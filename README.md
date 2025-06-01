# pr-changelog-action

Generate and maintain a changelog file based on the description field of a pull request.  It will take each line of the pull request description and add it to a bullet list of running changes, on top of continuing to maintain the existing list of changes by release versions.

The overall process for this action:

- When a pull request is created or edited:
    - Read the changelog from the target branch
    - Append any changes from the description to the list of pending changes (if any)
    - Write and commit the changelog file to othe source branch
- When creating a release (this action will not do all of these steps):
    - Use this action to retrieve the list of pending changesa
    - Tag the release
    - Create a release with the list of pending changes
    - Update the changelog is main, with the new version # (capability coming soon)


## Format of changelog

The default file location is root of the repository and named `CHANGELOG.md`.  This is the format of the changelog file that will be generated with the version titles added via the release process outlined above.

```markdown
- pending change 1
- pending change 2

## v1.0.1
- released change 3
- released change 4

## v1.0.0
- released change 1
- released change 2
```

## Parameters

This repository contains 2 actions, one to create/update the changelog file (`anlai/pr-changelog-action/generate`), and one that will parse the change log and return latest unreleased changes (`anlai/pr-changelog-action/latest-changes`).

| name | type | required | description |
| --- | --- | --- | --- |
| changelog-path | input | no | path and filename to the changelog file, relative path from the root of the repository <br/> **default:** CHANGELOG.md |
| verbose | input | no | verbose output<br/> **default:** false |
| changelog | output | n/a | the list of pending changes which can be used for other workflow actions<br/> **note:** only populated with "latest-changes" action |

## Usage:

Generate/update the changelog file, with the default location

```yaml
uses: anlai/pr-changelog-action/generate@main
```

Generate/update the changelog file, at a custom location

```yaml
uses: anlai/pr-changelog-action/generate@main
with:
    changelog-path: 'release/changelog.md'
```

Get the list of pending changes in the change log, echo the changes, but can be used to input into other actions

```yaml
- uses: anlai/pr-changelog-action/latest-changes@main
  id: latest-changes

- run: |
    echo "${{ steps.latest-changes.outputs.changelog }}"
```