# queue

A set of commands to manage the [DVC experiments] task queue:
[start](/command-reference/queue/start), [stop](/command-reference/queue/stop),
[status](/command-reference/queue/status),
[logs](/command-reference/queue/logs),
[remove](/command-reference/queue/remove), [kill](/command-reference/queue/kill)

[dvc experiments]: /user-guide/experiment-management

## Synopsis

```usage
dvc queue {start,stop,status,logs,remove,kill}
```

## Description

You can use `dvc exp run --queue` to queue ML experiments. `dvc queue` provides
an interface to process and manage these queued tasks.

<admon icon="book">

See [this guide] for more information on experiment queues.

[this guide]:
  /user-guide/experiment-management/running-experiments#the-experiments-queue

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
