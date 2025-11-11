flowchart TD
    A[Start] --> B[Customer Interface]
    A --> J[Admin Interface]
    B --> C{User Logged In}
    C -- Yes --> D[Browse Products]
    C -- No --> E[Login Page]
    E --> C
    D --> F[Add to Cart]
    F --> G[Checkout]
    G --> H[API Request Create Order]
    H --> I[Database]
    I --> OC[Order Confirmation]
    OC --> D
    J --> K{Admin Logged In}
    K -- Yes --> L[Dashboard]
    K -- No --> M[Admin Login Page]
    M --> K
    L --> N[Manage Products]
    L --> O[Manage Orders]
    L --> P[View Analytics]
    N --> Q[API Request Product CRUD]
    O --> R[API Request Order CRUD]
    P --> S[API Request Analytics]
    Q --> I
    R --> I
    S --> I