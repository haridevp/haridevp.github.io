# 🚗 Autonomous Navigation via Rainbow DQN (Springer LNNS)

> **Publication**: *"An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN"*  
> **Authors**: Haridev P (*Corresponding Author*), et al.  
> **Proceedings**: Springer Lecture Notes in Networks and Systems (LNNS) · Scopus-Indexed  
> **Venue**: SCRS Conference on Communication, Information and Measurement Applications (CIMA 2026), NIT Puducherry

---

### Abstract & Core Contribution

Autonomous vehicle safety in high-density urban traffic demands predictive decision-making that balances collision avoidance with trajectory efficiency. Traditional Deep Q-Networks (DQN) suffer from overestimation bias, sample inefficiency, and instability in dynamic multi-agent environments.

This paper proposes an adaptive reinforcement learning framework integrating **Rainbow DQN**—combining seven distinct advancements in deep reinforcement learning—to jointly solve dynamic lane change prediction and real-time obstacle avoidance.

```text
+-----------------------------------------------------------------------------------+
|                        RAINBOW DQN REINFORCEMENT LEARNING ARCHITECTURE            |
|                                                                                   |
|  [Sensory Input / State Vector]                                                   |
|  • Relative Velocity (v_rel)                                                     |
|  • Inter-Vehicle Distance (d_lead, d_lag)                                         |
|  • Lane Occupancy Status                                                          |
|  • Time-to-Collision (TTC)                                                        |
|                 │                                                                 |
|                 ▼                                                                 |
|  [Rainbow Network Core]                                                           |
|  ├── 1. Double Q-Learning (Removes overestimation bias)                          |
|  ├── 2. Prioritized Experience Replay (PER - Samples critical edge cases)        |
|  ├── 3. Dueling Architecture (Separates State-Value V(s) and Advantage A(s,a))   |
|  ├── 4. Multi-Step Learning (n-step return bootstrapping)                        |
|  ├── 5. Distributional RL (C51 - Models full probability distribution of returns)|
|  └── 6. Noisy Networks (Stochastic weights for efficient state exploration)       |
|                 │                                                                 |
|                 ▼                                                                 |
|  [Discrete Action Policy]                                                         |
|  • Maintain Lane / Accelerate                                                     |
|  • Decelerate / Emergency Brake                                                   |
|  • Left Lane Change / Right Lane Change                                           |
+-----------------------------------------------------------------------------------+
```

---

### Mathematical Formulation

#### 1. State Space $\mathcal{S}$
The observation vector at time step $t$ encodes ego-vehicle kinematics and neighboring target vehicle metrics across adjacent left, center, and right lanes:

$$s_t = \begin{bmatrix} v_{\text{ego}}, & a_{\text{ego}}, & d_{\text{front}}, & \Delta v_{\text{front}}, & d_{\text{left}}, & \Delta v_{\text{left}}, & d_{\text{right}}, & \Delta v_{\text{right}}, & \text{TTC} \end{bmatrix}^T$$

Where $\text{TTC}$ (Time-to-Collision) is given by:

$$\text{TTC} = \frac{d_{\text{lead}}}{v_{\text{ego}} - v_{\text{lead}}} \quad \text{for } v_{\text{ego}} > v_{\text{lead}}$$

#### 2. Multi-Objective Reward Function $\mathcal{R}$
The reward function balances safety, lane progression, and passenger comfort:

$$\mathcal{R}_t = r_{\text{speed}} + r_{\text{safety}} + r_{\text{efficiency}} + r_{\text{comfort}}$$

* **Safety Penalty**: $r_{\text{safety}} = -100$ if $\text{TTC} < \tau_{\text{critical}}$ (or collision occurs).
* **Speed Incentive**: $r_{\text{speed}} = \alpha \cdot \frac{v_{\text{ego}}}{v_{\text{target}}}$
* **Comfort Penalty**: $r_{\text{comfort}} = -\beta \cdot |j_{\text{lateral}}| - \gamma \cdot |a_{\text{longitudinal}}|$ (penalizes abrupt lateral jerk).

---

### Experimental Results & Validation

Tested against high-density highway traffic scenarios in simulation:
* **Collision Rate Reduction**: $41.3\%$ decrease compared to vanilla Deep Q-Networks.
* **Convergence Speed**: $2.8\times$ faster convergence to optimal policy via Prioritized Experience Replay.
* **Trajectory Smoothness**: Sustained average lateral acceleration below $1.8 \text{ m/s}^2$, satisfying ISO 26262 functional safety guidelines.
