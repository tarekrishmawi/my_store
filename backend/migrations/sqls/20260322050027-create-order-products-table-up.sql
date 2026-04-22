CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    CONSTRAINT fk_order_products_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_products_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_order_product
        UNIQUE (order_id, product_id)
);