CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

     status VARCHAR(20)
        NOT NULL
        DEFAULT 'active'
        CHECK (status IN ('active', 'complete')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);