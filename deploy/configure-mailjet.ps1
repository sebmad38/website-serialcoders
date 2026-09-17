# Prompts for Mailjet credentials inside SSH so they never enter this repository.
$ErrorActionPreference = 'Stop'
$deploymentKey = Join-Path $env:TEMP 'serialcoders-deploy-key.pem'
$deploymentKnownHosts = Join-Path $env:TEMP 'serialcoders-known-hosts'
if (-not (Test-Path -LiteralPath $deploymentKey)) {
    throw 'The protected SSH key copy is missing. Ask Codex to prepare it again.'
}
ssh -t -i $deploymentKey -o ConnectTimeout=15 -o HostKeyAlias=13.37.227.84 -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$deploymentKnownHosts" ubuntu@13.39.55.229 'sudo python3 /root/serialcoders-configure-smtp.py'
if ($LASTEXITCODE -ne 0) { throw 'SMTP configuration did not complete.' }
