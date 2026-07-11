# DEPLOYMENT POLICY

Canonical. Binding. This file is the gate. It exists because a deployment-gate incident occurred while it did not exist (DEPLOYMENT-INCIDENT-01: an agent pushed to a production-connected branch during a local-merge-only task).

Owner: Maxim Geller. Only Maxim authorizes production-affecting actions.
Location: docs/operations/DEPLOYMENT_POLICY.md
Applies to: every agent, every repository (tt-stack, tt-mobile, tt-landing), every release task.

---

## 1 · DEFINITION: PRODUCTION-AFFECTING ACTION

A production-affecting action is ANY of the following:

- commit to a release-connected branch
- merge
- push
- environment variable change
- database migration
- preview deployment
- production deployment
- domain or alias change
- rollback

This is a DEFINITION, not a checklist of prohibitions. If an action appears in this list, it is production-affecting, regardless of how it is framed, regardless of whether it "actually deploys", and regardless of the agent's belief about its consequences.

Each action requires a SEPARATE, EXPLICIT approval from Maxim, naming that specific action.

## 2 · WHAT DOES NOT AUTHORIZE ANYTHING

The following phrases authorize NOTHING on the list above:
- "go"
- "continue"
- "prepare release"
- "prepare the deployment"
- "Stage 1" (or any stage name)
- "approved" (when it refers to a plan, not to a specific action)
- a plan being approved
- a previous task having been approved

General approval language never authorizes a production-affecting action. Approval of a PLAN is not approval of an ACTION within it.

## 2A · WHO MAY GRANT APPROVAL

Only Maxim Geller may authorize a production-affecting action. No agent, no other person, and no document may authorize one on his behalf. An agent may never authorize itself, and may never treat another agent's report, a plan, a prior approval, or its own reasoning as authorization.

If Maxim is unavailable, the action does not happen. There is no fallback approver.

## 2B · HOW AN ACTION-SPECIFIC APPROVAL IS RECORDED

A valid approval names the ACTION, the TARGET, and is given by Maxim in the conversation authorizing that task. It must be quoted verbatim in the task's preflight block.

Valid example: "Approved: push docs/deployment-policy to origin." (names action + target)
Invalid: "go", "continue", "approved", "Stage 1", "prepare the release", approval of a plan, approval of a different action, an approval given for an earlier task.

If an agent cannot quote a specific approval naming the exact action it is about to take, that action is NOT authorized. STOP.

An approval covers exactly one action on one target. Approval to commit is not approval to push. Approval to push one branch is not approval to push another. Approval to merge is not approval to deploy.

## 2C · CONFLICT RULE (policy overrides the task)

If an agent task conflicts with this policy, THIS POLICY WINS. Always.

A task that appears to permit a production-affecting action without a specific Maxim approval does not thereby authorize it. Task wording, however confident, cannot override this file. An agent encountering such a conflict must STOP and report the conflict rather than follow the task.

If the task is silent on an action, the action is FORBIDDEN. Silence is not permission.

## 3 · RELEASE-CONNECTED BRANCHES (production-connected)

- tt-stack: v3/foundation (Render deploy branch)
- tt-landing: main (Vercel production)
- tt-mobile: v3/foundation (trunk, source of app builds) and main (web production line)

Pushing to any of these is a production-affecting action even if no deploy is triggered. Entering the deployment pipeline IS the violation; a deploy actually firing is a separate, worse outcome.

## 4 · MANDATORY DEPLOYMENT PREFLIGHT

Every release-related task MUST open this file, and MUST return this block before performing ANY action:

```
DEPLOYMENT PREFLIGHT
Policy path:
Policy version/hash:
Current stage:
Current branch:
Production-connected branch: yes/no
Authorized actions:
Forbidden actions:
Push authorized by Maxim: yes/no
Merge authorized by Maxim: yes/no
Migration authorized by Maxim: yes/no
Deploy authorized by Maxim: yes/no
```

If ANY required authorization is NO or unclear: STOP. Do not proceed. Report and wait.

If this file cannot be read: STOP. A task that cannot read the policy cannot perform a production-affecting action.

## 5 · FORBIDDEN AGENT BEHAVIOUR (explicit)

- NEVER run a write command in order to "verify" a read-only fact. Do not run `git push` to check whether something is pushed. Use `git status`, `git log origin/<branch>..HEAD`, `git rev-parse origin/<branch>`. A destructive command is never a test.
- NEVER assume that because a deploy hook might not fire, an action is safe.
- NEVER interpret "no deploy" narrowly as "do not click Deploy". It means: do not take any production-affecting action from section 1.
- NEVER proceed on a general approval. Find the specific, action-named approval, or STOP.
- If credentials happen to permit an action the task forbids, that permission is irrelevant. The task governs.

## 6 · STAGE MODEL (from the founder's deploy policy)

- Stage 1 LOCAL: runs locally, tested locally, bugs fixed. No push to a release-connected branch. No production deploy. Proceed only on Maxim's explicit approval.
- Stage 2 PREVIEW: build preview, verify UI, navigation, API, refresh, console, smoke test. Proceed only on Maxim's second explicit approval.
- Stage 3 PRODUCTION: ONLY Maxim performs the merge to trunk, the production deploy, and any domain or alias change.

Agents never push to a release-connected branch, never merge to trunk, never deploy production, never switch domains.

If a local run is impossible (missing dependencies, will not start, missing env): the agent STOPS and reports LOCAL TEST BLOCKED. It never advances unverified work.

## 7 · MIGRATION CONTROL

Production migrations run only from an explicitly approved manifest.

- MIGRATION_ALLOWLIST names exactly which migrations may run.
- REQUIRE_MIGRATION_ALLOWLIST=true makes a missing allow-list a fatal error before any database mutation.
- A migration is never applied merely because it is numerically pending.
- A feature flag being off does NOT authorize that feature's schema to deploy. Schema is not the flag.

## 8 · PHYSICAL BARRIERS (the policy is not enough on its own)

Text does not stop an agent that misreads it. These barriers must exist:

- Branch protection on every release-connected branch (section 3): require a pull request, restrict who may push, and exclude agent credentials.
- Agent credentials must not carry push rights to release-connected branches.
- Render auto-deploy state must be OBSERVED (not assumed) and recorded: ON/OFF, branch, trigger, current live commit.

A policy without a physical barrier is a suggestion. This incident happened because the barrier did not exist.

## 9 · INCIDENT RULE

Any production-affecting action taken without a specific approval is a deployment-gate violation and must be reported immediately, even if production impact is zero. Zero impact is luck, not compliance. The report is mandatory; the agent must disclose it in its own output rather than let it be discovered.

---

## APPENDIX: WHY THIS FILE EXISTS

DEPLOYMENT-INCIDENT-01 (2026-07-11): during PCAP-P4-STAGE1-MERGE, a task that said "NO git push. Under any circumstances", an agent ran `git push` in order to verify that nothing had been pushed. The push succeeded, advancing origin/v3/foundation from 2817eb0 to 5ad38f8. Production did not deploy (Render is configured for manual deploy), so production impact was none. The gate was still violated. At the time of the incident, no canonical deployment policy file existed in the repository, no branch protection was in place, and the Render auto-deploy state had never been observed. This file closes the first of those three gaps. The other two are physical and must be configured by Maxim.
