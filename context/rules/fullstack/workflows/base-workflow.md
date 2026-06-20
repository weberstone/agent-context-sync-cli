# AI Workflow & Execution Rules
[CRITICAL] These rules define how the AI must operate in this project.

## Scope Evaluation

### Micro-Task
Local change in a single place with no architectural impact and no cross-module effects.

### Macro-Task
Any change that affects multiple files, involves architecture, or has unclear side effects.
If unclear → ask user to choose.

## For Macro-Task
Before you start running a **Macro-Task**, you must:
1. **Analyze & Planning**. If this is the beginning of a global task (the beginning of a project, the beginning of a new component or microservice), you should decompose the task and divide it into microtasks that are grouped into logical blocks/stages: 1 block = 1 independent commit - the result of which can be tested and shared between subagents (if the user wishes).
   Then create, modify, or supplement the `.agents/roadmap.md` file with tasks and their descriptions (requirements, features, etc.), as well as with a mark of the task readiness status according to the principle:
```text
[ ] Planned
[x] Done
```
The roadmap may change as the project progresses. [CRITICAL] Keep it up to date.

2. **Wait for Selection**: Only AFTER the user explicitly confirms the plan, you may start applying changes to the actual project files.

## Workflow (every task)

### Step 1 — Analysis
Assess the task and offer the user 2-3 solutions, indicating the pros and cons, code examples, and the impact on the project architecture for each approach.
Before starting a task, check the `.agents/memory.md` file. There may be a note from another agent that should be taken into account when performing the task.

### Step 2 — Approval Gate
Stop and wait for user approval. Implement only the approved scope.

### Step 3 — Выполнение задачи
The AI must:
- modify only files related to the approved stage;
- avoid unrelated refactors;
- avoid “improvements” outside scope.
  [CRITICAL] No autonomous architectural decisions.

#### 1. Write tests first
If a task affects the business logic of a module or component, you should write tests first, since you know what result you should get as a result of the task.

#### 2. Business logic code
- [CRITICAL] Write code strictly in accordance with code style & architecture rules.
- If you need to remember something or communicate to another agent about the specifics of working with a specific module, make notes in the `.agents/memory.md` file in accordance with the already defined architecture and be sure to provide a clear and understandable explanation. Keep it updated during work.

#### 3. Verification Protocol
After implementation:

Run:
- lint;
- format;
- typecheck;
- build;
- tests (if applicable).

Rules:
- fix only issues caused by current changes;
- do not touch pre-existing unrelated problems;
- do not guess fixes.
- re-run checks after fixed.

#### 4. State Sync
Before marking stage, complete the update & re-check a validation result:
- `roadmap.md`;
- `memory.md`.

#### 5. [CRITICAL] Git Control
The AI MUST NEVER run:
```bash
git commit
```
Flow:
1. AI completes stage.
2. User reviews.
3. User commits manually.
4. User confirms next step.

No exceptions.