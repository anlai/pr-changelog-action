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

## Actions

This repository contains 3 distinct actions which can be used via different workflows to complete the entire process of automated changelog and release creation.

### generate

Generates and updates the changelog file from PR descriptions.

Recommendation is to use this on pull request create/edit to ensure the file in the branch being pulled into default branch is updated as the pull request changes.

**Parameters:**
| name | type | required | description |
| --- | --- | --- | --- |
| changelog-path | input | no | path and filename to the changelog file, relative path from the root of the repository <br/> **default:** CHANGELOG.md |
| verbose | input | no | verbose output<br/> **default:** false |

**Usage:**

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

### latest-changes

Parse the latest changes from the changelog, which then gets written into an output parameter.

Recommendation is to this this as part of the release process to get the "pending" changes and write those into the release description.

**Parameters:**

| name | type | required | description |
| --- | --- | --- | --- |
| changelog-path | input | no | path and filename to the changelog file, relative path from the root of the repository <br/> **default:** CHANGELOG.md |
| verbose | input | no | verbose output<br/> **default:** false |
| changelog | output | n/a | the list of pending changes which can be used for other workflow actions<br/> **note:** only populated with "latest-changes" action |

**Usage:**

```yaml
- uses: anlai/pr-changelog-action/latest-changes@main
  id: latest-changes

- run: |
    echo "${{ steps.latest-changes.outputs.changelog }}"
```

### tag-release

Tag all pending changes with a release version and ensure format of the changelog is correct.  Note that if there are no "pending" changes in the changelog, it will create a bullet item with "no changes" as the value and tag the version.

Recommendation is to use this as part of the release process to update the changelog with a final version on pending changes prior to tagging and release creation.

## Parameters

| name | type | required | description |
| --- | --- | --- | --- |
| changelog-path | input | no | path and filename to the changelog file, relative path from the root of the repository <br/> **default:** CHANGELOG.md |
| verbose | input | no | verbose output<br/> **default:** false |
| tag | input | yes | tag to be used as the heading for the list of changes for the version |

## Usage:

Tag a release using the default change log file.

```yaml
uses: anlai/pr-changelog-action/tag-release@main
with:
    tag: v1.0.0
```

## Sample Workflows

```yaml
name: Generate Changelog

on:
  pull_request:
    types:
      - opened
      - edited

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
    - uses: anlai/pr-changelog-action/generate@main
```


```yaml
name: Create Release

on:
  workflow_dispatch:
    inputs:
      tag:
        description: ''
        required: true

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Get Pending Changes
      uses: anlai/pr-changelog-action/latest-changes@main
      id: latest-changes

    - name: Update Changelog with Version
      uses: anlai/pr-changelog-action/tag-release@main
      with:
        tag: "${{ inputs.tag }}"

    - name: Commit Changelog Changes
      uses: stefanzweifel/git-auto-commit-action@master
      with:
        commit_message: "tagged version ${{ inputs.tag }}"      
    
    - name: Release
      uses: softprops/action-gh-release@v2
      with:
        tag_name: "${{ inputs.tag }}"
        body: "${{ steps.latest-changes.outputs.changelog }}"
```