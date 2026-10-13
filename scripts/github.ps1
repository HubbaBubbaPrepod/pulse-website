param([ValidateSet('inspect','create','pages','status','https')][string]$Action='inspect')
$ErrorActionPreference='Stop'
$lines=@('protocol=https','host=github.com','') | git -c credential.interactive=never credential fill 2>$null
$credential=@{}
foreach($line in $lines){$parts=$line -split '=',2;if($parts.Count-eq 2){$credential[$parts[0]]=$parts[1]}}
if(!$credential['password']){throw 'GitHub credential unavailable'}
$headers=@{Authorization='Bearer '+$credential['password'];'X-GitHub-Api-Version'='2022-11-28';'User-Agent'='pulse-website-deployment'}
$base='https://api.github.com/repos/HubbaBubbaPrepod/pulse-website'
function Request([string]$Method,[string]$URL,$Body=$null){
 $arguments=@{Method=$Method;Uri=$URL;Headers=$headers}
 if($null-ne $Body){$arguments.ContentType='application/json';$arguments.Body=$Body|ConvertTo-Json -Depth 6}
 Invoke-RestMethod @arguments
}
switch($Action){
 'inspect' {try{$r=Request GET $base;[pscustomobject]@{Exists=$true;Name=$r.full_name;DefaultBranch=$r.default_branch;Size=$r.size}|ConvertTo-Json}catch{if($_.Exception.Response.StatusCode.value__-eq 404){'{"Exists":false}'}else{throw}}}
 'create' {$r=Request POST 'https://api.github.com/user/repos' @{name='pulse-website';description='Official Pulse website: self-hosted server monitoring for Linux and Windows. Next.js, GSAP, RU/EN and GitHub Pages.';homepage='https://pulse.hubba-cloud.ru';private=$false;auto_init=$false};Request PUT ($base+'/topics') @{names=@('pulse-monitor','nextjs','gsap','github-pages','self-hosted','monitoring','landing-page','seo')}|Out-Null;$r.html_url}
 'pages' {try{Request POST ($base+'/pages') @{build_type='workflow';source=@{branch='main';path='/'}}|Out-Null}catch{if($_.Exception.Response.StatusCode.value__-ne 409){throw}};Request PUT ($base+'/pages') @{build_type='workflow';cname='pulse.hubba-cloud.ru'}|Out-Null;Request GET ($base+'/pages')|Select-Object html_url,cname,status,https_enforced,https_certificate|ConvertTo-Json -Depth 4}
 'status' {Request GET ($base+'/actions/runs?per_page=3')|ForEach-Object workflow_runs|Select-Object id,status,conclusion,html_url,head_sha|ConvertTo-Json;try{Request GET ($base+'/pages')|Select-Object html_url,cname,status,https_enforced,https_certificate|ConvertTo-Json -Depth 4}catch{Write-Output 'Pages not configured yet'}}
 'https' {Request PUT ($base+'/pages') @{https_enforced=$true}|Out-Null;Request GET ($base+'/pages')|Select-Object html_url,cname,https_enforced,https_certificate|ConvertTo-Json -Depth 4}
}
