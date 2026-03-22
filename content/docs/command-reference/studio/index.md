# studio

A set of commands to authenticate DVC with Studio and save a
[client access token](https://docs.datachain.ai/studio/api#authorization) to
global [DVC configuration]: [login](/command-reference/studio/login),
[logout](/command-reference/studio/logout),
[token](/command-reference/studio/token).

[dvc configuration]:
  /user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
dvc studio {login,logout,token}
```

## Description

`dvc studio` authenticates DVC with Studio and sets the token. Once this token
has been properly configured, DVC will utilize it for seamlessly sharing live
experiments, sending notifications to Studio regarding any experiments that have
been pushed and downloading artifacts using `dvc artifacts get`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
