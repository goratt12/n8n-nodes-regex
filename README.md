# n8n-nodes-regex

This is an n8n community node. It lets you use regular expressions (regex) directly in your n8n workflows for advanced text matching and extraction.

Regex is a powerful pattern matching language used for searching, parsing, and manipulating strings. This node brings flexible regex matching with support for flags, named capture groups, and multiple match results.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node provides the following operation:

- **Regex Match**: Apply a regular expression to a text input, supporting capture groups, named groups, and multiple matches via flags.

## Compatibility

- Requires n8n `v1.0.0` or later.
- Tested on n8n `v1.36.0`.
- No external credentials or services required.

## Usage

### Inputs

- **Text**: The string to evaluate against the regex pattern. Can be set using an expression.
- **Regex Pattern**: The regular expression to apply (omit surrounding slashes `/`).
- **Flags**: Optional modifiers such as:
  - `g` (global): Find all matches.
  - `i` (ignore case): Case-insensitive match.
  - `m` (multiline), `s` (dot matches newline), `u` (unicode), `y` (sticky).

### Output

- One output item per match (if `g` flag is used).
- Each output item includes:
  - `match`: Full matched string.
  - Named groups (if used): Added as individual fields.
  - Unnamed groups: Added as `group1`, `group2`, etc.

### Behavior

- If the regex is invalid, the node will throw a clear error with details.
- If there are no matches, the node outputs no items.
- Each incoming item is processed independently.

### Example

**Pattern**: `(?<first>\\w+) (?<second>\\w+)`  
**Text**: `"hello world"`

**Output**:
```json
{
  "match": "hello world",
  "first": "hello",
  "second": "world"
}
