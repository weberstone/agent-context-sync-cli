# Changelog

## [0.3.3] — 2026-06-17

### Changed
- Agent manifest directives: enforce reading + loading rules at initialization,
  follow them for every task (all 7 generators)
- Skills path: fix folder-skill reference (`SKILL.md` → full path)
- Skills section: write as sibling of RULES (not nested), update on re-runs
- content-wrapper: add `updateSkills()` / `hasSkillsMarkers()` for dual-section sync

### Changed
- Agent definitions consolidated: `AGENT_META` in `generator.types.ts` is now
  the single source of truth for agent keys and labels. `AgentKey` type,
  `AVAILABLE_AGENTS`, and `GeneratorRegistry` all derive from it.
- Architecture constants consolidated: `ALL_ARCHITECTURES` and `ARCH_LABELS`
  in `config.types.ts` replace 4 separate definitions across the codebase.
- SKILLS markers exported from `content-wrapper.ts` — `output.service.ts`
  imports instead of re-declaring them.
- Generator text strings consolidated: all 7 generators now share a single
  `assemble()` function. Duplicated strings (`.agents/rules/`, frontmatter
  description, table formatting) extracted into constants `R`,
  `FRONTMATTER_DESC`, `TABLE_ROW`, and `formatRules()`. Each generator
  is now a thin 5-10 line wrapper.
- Rule file names consolidated: `F` constant in `compiler.types.ts` is the
  single source of truth for all 6 rule filenames. `compiler.service.ts`,
  `prompts.service.ts`, `orchestrator.service.ts`, and `generator.service.ts`
  all import from it. `RULE_FILE_SET` replaces local `KNOWN_RULE_FILES`.

### Fixed
- Orchestrator: "Use existing config" path now skips all prompts (sync rules,
  sync skills, skills questionnaire, agent selection) and regenerates
  everything from saved config values instead of re-asking each question.


## [0.3.2] — 2026-06-17

### Changed
- Agent manifest templates: removed redundant meta-descriptions, unified
  phrasing across all 8 agents, cleaned up duplicate sections (Working
  agreements, Usage Instructions).
- Rule file descriptions in priority tables made more generic — describe
  purpose rather than assumed content, since users write their own rules.
- Skills section now explicitly instructs agents to load skills on demand
  instead of reading all at startup.
- Core Directives reworded to reference the Rule Manifest table by name
  and emphasize opening every referenced file.
- Removed dead `nameConflict` flag from `ParsedSkill` type and simplified
  `SkillsDiscoveryService.addSkill()`.

  
## [0.3.1] — 2026-06-16

### Changed
- Multiselect prompts (skills, packages, fullstack frameworks): "⊘ Skip"
  checkbox removed. Empty selection (Enter with nothing checked) acts as
  skip. Radio selects keep the explicit "⊘ Skip" option.
- Prompt messages now show the actual context directory name (e.g.
  `context-primary/`) instead of hardcoded `context/`.

### Fixed
- `.env` parser correctly handles combined quotes and inline comments.


## [0.3.0] — 2026-06-16

### Added
- Skip option for every rule type — last item "⊘ Skip" in radio lists,
  Enter with empty selection in multiselect

## [0.2.0] — 2026-06-16

### Added
- Skip option for every rule type — last item "⊘ Skip" in radio lists,
  Enter with empty selection in multiselect