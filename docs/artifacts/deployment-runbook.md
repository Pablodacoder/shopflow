# Deployment Runbook

## Normal deploy
1. Merge PR to `main` (CI must be green).
2. Platform auto-deploys `main` (or run manual deploy command for your host).
3. Run post-deploy checklist (see `docs/DEPLOYMENT.md` §7).

## Rolling back a bad deploy
1. Identify last known-good commit/tag.
2. Redeploy that commit via platform dashboard or `git revert` + push.
3. If a migration shipped with the bad deploy, confirm it's backward
   compatible before rolling the app back (don't roll back the app while a
   newer migration is still applied, or you'll get schema mismatches).

## Incident response (if the site goes down)
1. Check `/api/metrics` — is the app up but DB unreachable, or fully down?
2. Check Sentry for the error spike.
3. Check hosting platform status page for an outage on their end.
4. If it's a bad deploy: roll back (see above).
5. Post a one-line incident note in the team channel with timestamp + cause
   once resolved, for the retro.

## On-call / who to contact
[Fill in with team member names + how to reach them during the demo window]
