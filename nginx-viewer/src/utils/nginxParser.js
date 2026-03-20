/**
 * nginx.conf parser — tokenizer + recursive descent parser
 * No external dependencies.
 */

// ─────────────────────────────────────────
// Tokenizer
// ─────────────────────────────────────────

const T = {
  WORD:     'WORD',
  LBRACE:   'LBRACE',
  RBRACE:   'RBRACE',
  SEMI:     'SEMI',
  COMMENT:  'COMMENT',
  EOF:      'EOF',
}

function tokenize(src) {
  const tokens = []
  let i = 0

  while (i < src.length) {
    const ch = src[i]

    // Whitespace
    if (/\s/.test(ch)) { i++; continue }

    // Comment
    if (ch === '#') {
      let j = i + 1
      while (j < src.length && src[j] !== '\n') j++
      tokens.push({ type: T.COMMENT, value: src.slice(i + 1, j).trim() })
      i = j
      continue
    }

    if (ch === '{') { tokens.push({ type: T.LBRACE }); i++; continue }
    if (ch === '}') { tokens.push({ type: T.RBRACE }); i++; continue }
    if (ch === ';') { tokens.push({ type: T.SEMI });   i++; continue }

    // Quoted string
    if (ch === '"' || ch === "'") {
      const quote = ch
      let j = i + 1
      while (j < src.length && src[j] !== quote) {
        if (src[j] === '\\') j++ // skip escaped char
        j++
      }
      tokens.push({ type: T.WORD, value: src.slice(i, j + 1) })
      i = j + 1
      continue
    }

    // Word (anything up to whitespace / special chars)
    let j = i
    while (j < src.length && !/[\s{};"'#]/.test(src[j])) j++
    if (j > i) {
      tokens.push({ type: T.WORD, value: src.slice(i, j) })
      i = j
      continue
    }

    // Fallback — skip unknown char
    i++
  }

  tokens.push({ type: T.EOF })
  return tokens
}

// ─────────────────────────────────────────
// Parser
// ─────────────────────────────────────────

function parse(src) {
  if (!src || !src.trim()) return { ok: true, ast: [] }

  let tokens
  try {
    tokens = tokenize(src)
  } catch (e) {
    return { ok: false, error: `Tokenizer error: ${e.message}` }
  }

  let pos = 0
  const peek = () => tokens[pos]
  const consume = () => tokens[pos++]

  function parseBlock() {
    const nodes = []

    while (true) {
      const tok = peek()

      if (tok.type === T.EOF || tok.type === T.RBRACE) break

      if (tok.type === T.COMMENT) {
        consume()
        nodes.push({ type: 'comment', text: tok.value })
        continue
      }

      if (tok.type === T.WORD) {
        // Collect words until { or ;
        const words = []
        while (peek().type === T.WORD) {
          words.push(consume().value)
        }

        const next = peek()

        if (next.type === T.LBRACE) {
          consume() // eat {
          const children = parseBlock()
          if (peek().type !== T.RBRACE) {
            throw new Error(`Missing closing '}' for block '${words[0]}'`)
          }
          consume() // eat }

          nodes.push({
            type: 'block',
            name: words[0],
            params: words.slice(1),
            children,
          })
        } else if (next.type === T.SEMI) {
          consume() // eat ;
          const name = words[0]
          const values = words.slice(1)

          if (name === 'include') {
            nodes.push({ type: 'include', pattern: values.join(' ') })
          } else {
            nodes.push({ type: 'directive', name, values })
          }
        } else if (next.type === T.EOF) {
          // Directive without semicolon at end of file — warn but continue
          const name = words[0]
          const values = words.slice(1)
          nodes.push({ type: 'directive', name, values, missingSemi: true })
        } else {
          throw new Error(`Unexpected token '${next.type}' after '${words.join(' ')}'`)
        }
        continue
      }

      // Unexpected token
      throw new Error(`Unexpected token type '${tok.type}'`)
    }

    return nodes
  }

  try {
    const ast = parseBlock()
    if (peek().type !== T.EOF) {
      return { ok: false, error: `Unexpected '}' — too many closing braces` }
    }
    return { ok: true, ast }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

// ─────────────────────────────────────────
// Formatter  (AST → plain string)
// ─────────────────────────────────────────

function formatNode(node, depth, indentStr) {
  const indent = indentStr.repeat(depth)

  if (node.type === 'comment') {
    return `${indent}# ${node.text}`
  }

  if (node.type === 'include') {
    return `${indent}include ${node.pattern};`
  }

  if (node.type === 'directive') {
    const semi = node.missingSemi ? '' : ';'
    return `${indent}${node.name}${node.values.length ? ' ' + node.values.join(' ') : ''}${semi}`
  }

  if (node.type === 'block') {
    const header = `${indent}${node.name}${node.params.length ? ' ' + node.params.join(' ') : ''} {`
    const body = node.children.map(c => formatNode(c, depth + 1, indentStr)).join('\n')
    const close = `${indent}}`
    return body ? `${header}\n${body}\n${close}` : `${header}\n${close}`
  }

  return ''
}

export function format(ast, indentStr = '  ') {
  const lines = ast.map(n => formatNode(n, 0, indentStr))
  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

// ─────────────────────────────────────────
// Highlighter  (AST → HTML string)
// ─────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightNode(node, depth, indentStr) {
  const pad = indentStr.repeat(depth)

  if (node.type === 'comment') {
    return `${pad}<span class="hl-comment"># ${esc(node.text)}</span>`
  }

  if (node.type === 'include') {
    return `${pad}<span class="hl-include-kw">include</span> <span class="hl-include-path">${esc(node.pattern)}</span><span class="hl-punct">;</span>`
  }

  if (node.type === 'directive') {
    const semi = node.missingSemi ? '' : '<span class="hl-punct">;</span>'
    const vals = node.values.length
      ? ' ' + node.values.map(v => `<span class="hl-value">${esc(v)}</span>`).join(' ')
      : ''
    const warn = node.missingSemi ? ' <span class="hl-warn">⚠</span>' : ''
    return `${pad}<span class="hl-key">${esc(node.name)}</span>${vals}${semi}${warn}`
  }

  if (node.type === 'block') {
    const params = node.params.length
      ? ' ' + node.params.map(p => `<span class="hl-param">${esc(p)}</span>`).join(' ')
      : ''
    const header = `${pad}<span class="hl-block">${esc(node.name)}</span>${params} <span class="hl-punct">{</span>`
    const body = node.children.map(c => highlightNode(c, depth + 1, indentStr)).join('\n')
    const close = `${pad}<span class="hl-punct">}</span>`
    return body ? `${header}\n${body}\n${close}` : `${header}\n${close}`
  }

  return ''
}

export function highlight(ast, indentStr = '  ') {
  const lines = ast.map(n => highlightNode(n, 0, indentStr))
  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

// ─────────────────────────────────────────
// Summarize  (AST → summary object)
// ─────────────────────────────────────────

function findDirective(children, name) {
  for (const n of children) {
    if (n.type === 'directive' && n.name === name) return n.values.join(' ')
  }
  return null
}

function findAllDirectives(children, name) {
  return children
    .filter(n => n.type === 'directive' && n.name === name)
    .map(n => n.values.join(' '))
}

function walkBlocks(nodes, name, cb) {
  for (const n of nodes) {
    if (n.type === 'block') {
      if (n.name === name) cb(n)
      walkBlocks(n.children, name, cb)
    }
  }
}

function walkAll(nodes, cb) {
  for (const n of nodes) {
    cb(n)
    if (n.type === 'block') walkAll(n.children, cb)
  }
}

export function summarize(ast) {
  const summary = {
    worker: {},
    gzip: null,
    virtualHosts: [],
    upstreams: [],
    locations: [],
    ssl: [],
  }

  // Worker settings (top-level)
  for (const n of ast) {
    if (n.type === 'directive' && n.name === 'worker_processes') {
      summary.worker.processes = n.values.join(' ')
    }
  }

  // worker_connections inside events {}
  walkBlocks(ast, 'events', b => {
    const wc = findDirective(b.children, 'worker_connections')
    if (wc) summary.worker.connections = wc
  })

  // Gzip — find anywhere
  walkAll(ast, n => {
    if (n.type === 'directive' && n.name === 'gzip' && summary.gzip === null) {
      summary.gzip = n.values[0] || 'on'
    }
  })

  // Upstreams
  walkBlocks(ast, 'upstream', b => {
    summary.upstreams.push({
      name: b.params.join(' '),
      servers: findAllDirectives(b.children, 'server'),
    })
  })

  // Virtual hosts (server blocks)
  walkBlocks(ast, 'server', b => {
    const listens = findAllDirectives(b.children, 'listen')
    const serverNames = findAllDirectives(b.children, 'server_name')

    // SSL certs
    const certs = findAllDirectives(b.children, 'ssl_certificate')
    summary.ssl.push(...certs)

    // Locations inside this server
    walkBlocks(b.children, 'location', loc => {
      const path = loc.params.join(' ')
      const proxyPass = findDirective(loc.children, 'proxy_pass')
      const root = findDirective(loc.children, 'root')
      const alias = findDirective(loc.children, 'alias')
      summary.locations.push({ path, proxyPass, root, alias })
    })

    summary.virtualHosts.push({
      listen: listens,
      serverName: serverNames,
    })
  })

  // Deduplicate ssl certs
  summary.ssl = [...new Set(summary.ssl)]

  return summary
}

// ─────────────────────────────────────────
// Public API
// ─────────────────────────────────────────

export { parse }
