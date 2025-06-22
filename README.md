# @superfleb/bump

Tools to "bump" the version of the current package.json up by one. Provides the following commands:

## `bump <path> [patch|minor|major]`

Increment the version number in package.json by 1 (patch) or increment it and zero out lower-scope values (minor/major).

## `bumpIfRequired <path> [major|minor|patch]`

Bumps the version, unless the Git tag of the current commit is the same as the current version.

## `tag <path>`

Creates a Git tag with the version number from package.json. This must be run within the Git repo in question. (The "path" option is only meant to point to the `package.json`.)
