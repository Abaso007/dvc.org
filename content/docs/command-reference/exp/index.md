# exp

> Alias of `dvc experiments`.

A set of commands to generate and manage <abbr>experiments</abbr>:
[run](/command-reference/exp/run), [show](/command-reference/exp/show),
[diff](/command-reference/exp/diff), [apply](/command-reference/exp/apply),
[branch](/command-reference/exp/branch),
[remove](/command-reference/exp/remove), [push](/command-reference/exp/push),
[pull](/command-reference/exp/pull), [list](/command-reference/exp/list), and
[clean](/command-reference/exp/clean).

> Requires that Git is being used to version the project.

## Synopsis

```usage
dvc exp {show,apply,diff,run,branch,list,push,pull,remove,clean}
```

## Description

`dvc exp` subcommands provide specialized ways to create and manage data
science/ machine learning experiments.

<admon icon="book">

See [Experiment Management](/user-guide/experiment-management) for more info.

</admon>

<admon type="warn">

Note that DVC assumes that experiments are deterministic (see [Avoiding
unexpected behavior]).

[avoiding unexpected behavior]:
  /user-guide/project-structure/dvcyaml-files#avoiding-unexpected-behavior

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
