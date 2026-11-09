# ⚙️ Distributed Systems & Consensus Engineering

> **Author**: Haridev P  
> **Repository**: [github.com/haridevp/distributed-kv-project](https://github.com/haridevp/distributed-kv-project)  
> **Tech Stack**: Go (Golang) · `net/rpc` · Docker · Mutex Concurrency · JSON Persistence

---

### System Architecture

The distributed key-value store was engineered in Go to explore fault-tolerant replication, network partitioning, and consensus primitives across clustered Linux containers.

```text
               +-------------------------------------------+
               |               Client Request              |
               |         (GET, SET, DELETE via RPC)        |
               +-------------------------------------------+
                                     │
                                     ▼
                      +-----------------------------+
                      |       Node 1 (Leader)       |
                      |  192.168.10.2:8080 (RPC)    |
                      +-----------------------------+
                        /                         \
         Replicate RPC /                           \ Replicate RPC
                      v                             v
       +-----------------------------+   +-----------------------------+
       |       Node 2 (Follower)     |   |       Node 3 (Follower)     |
       |  192.168.10.3:8080 (RPC)    |   |  192.168.10.4:8080 (RPC)    |
       +-----------------------------+   +-----------------------------+
```

---

### Core Engineering Primitives

#### 1. In-Memory Concurrency & Thread-Safety
The in-memory storage engine utilizes Go's `sync.RWMutex` to guarantee safe concurrent reads without blocking while serializing write mutations:

```go
package store

import "sync"

type KeyValueStore struct {
    mu    sync.RWMutex
    data  map[string]string
    wal   *WALLogger
}

func (s *KeyValueStore) Get(key string) (string, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    val, exists := s.data[key]
    return val, exists
}

func (s *KeyValueStore) Set(key, value string) error {
    s.mu.Lock()
    defer s.mu.Unlock()
    
    // 1. Commit to Write-Ahead Log before mutating in-memory state
    if err := s.wal.AppendEntry("SET", key, value); err != nil {
        return err
    }
    
    s.data[key] = value
    return nil
}
```

#### 2. Write-Ahead Logging (WAL) & Crash Recovery
To survive unexpected container crashes or power failures, all mutation operations (`SET`, `DELETE`) are appended sequentially to an append-only transaction log on disk before memory state is updated. On reboot, the storage engine replays the log sequentially from the latest snapshot offset.

#### 3. Inter-Node RPC Protocol
Cluster synchronization is handled via Go's standard library `net/rpc` over persistent TCP sockets, eliminating heavyweight HTTP overhead for inter-node heartbeats and state broadcasting.

---

### Consensus Protocol Comparison Matrix

| Consensus Algorithm | Fault Model | Quorum Size | Throughput | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Raft** | Crash Fault Tolerant (CFT) | $\lfloor N/2 \rfloor + 1$ | High ($>10^4$ ops/sec) | etcd, Consul, Kubernetes |
| **Multi-Paxos** | Crash Fault Tolerant (CFT) | $\lfloor N/2 \rfloor + 1$ | High ($>10^4$ ops/sec) | Google Chubby, Spanner |
| **PBFT** | Byzantine Fault Tolerant (BFT) | $2f + 1$ | Moderate ($<10^3$ ops/sec) | Permissioned Blockchains |
| **Proof of Work (PoW)**| Sybil / Byzantine | Longest chain / Hashrate | Low ($<15$ tps) | Bitcoin, Classic L1s |
