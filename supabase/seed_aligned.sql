-- Aligned Seed Data for UCEnterprises (Matches database_schema.sql)

-- 1. Seed Brands
INSERT INTO brands (name, slug, description, is_featured) VALUES
('STMicroelectronics', 'stmicroelectronics', 'Global semiconductor leader serving customers across the spectrum of electronics applications.', true),
('Texas Instruments', 'texas-instruments', 'Designs, manufactures, tests and sells analog and embedded semiconductors.', true),
('Microchip Technology', 'microchip', 'Provides smart, connected and secure embedded control solutions.', true),
('Espressif Systems', 'espressif', 'World-leading IoT solutions provider with a focus on Wi-Fi and Bluetooth.', true),
('Nordic Semiconductor', 'nordic', 'Specializes in wireless communication technology that powers the IoT.', true);

-- 2. Seed Categories
INSERT INTO categories (name, slug, description) VALUES
('Microcontrollers', 'microcontrollers', 'Versatile microcontrollers for embedded systems and IoT prototypes.'),
('Sensors', 'sensors', 'Precision sensing technology for motion, environment, and industrial automation.'),
('ICs & Processors', 'ics-processors', 'High-performance integrated circuits and processors for industrial applications.'),
('Power Modules', 'power-modules', 'Efficient power management solutions, including AC-DC and DC-DC converters.');

-- 3. Seed Products
-- Note: Using subqueries to get IDs
DO $$ 
DECLARE 
    mcu_id UUID := (SELECT id FROM categories WHERE slug = 'microcontrollers');
    st_id UUID := (SELECT id FROM brands WHERE slug = 'stmicroelectronics');
    ti_id UUID := (SELECT id FROM brands WHERE slug = 'texas-instruments');
    nordic_id UUID := (SELECT id FROM brands WHERE slug = 'nordic');
    esp_id UUID := (SELECT id FROM brands WHERE slug = 'espressif');
BEGIN
    -- STM32
    INSERT INTO products (name, slug, sku, description, brand_id, category_id, base_price, stock_quantity, specifications, images)
    VALUES (
        'STM32F405RGT6', 
        'stm32f405rgt6', 
        'UC-MCU-00492-ST', 
        'High-performance DSP with FPU, 168 MHz MCU, 1MB Flash, 192KB RAM.', 
        st_id, 
        mcu_id, 
        12.45, 
        4502, 
        '{"Core": "ARM Cortex-M4", "Speed": "168 MHz", "Flash": "1 MB"}'::jsonb,
        '{"https://lh3.googleusercontent.com/aida-public/AB6AXuAdrj1Q40t68xJ15YsZf30qD7Ff6SR_DF25DVaITuQpvpmmKrqG_NyrObFeCnZlEcVSTj63jZ_NVcekCxvhJi19jcoCSJy84grYElkem3eeqLmwCvDZP5mxBsn_Yzzh0B3QgPaZ9-02FcMckJXS3OT6OVemq53PQckN9UFezV-LU00d9JxTMdb9UePqAx8ZbbIG5E4i-EeMLnThnPv-kjw_ms3VTHZH9eHZ50vDNZv0qpAbdFouT4NjZ0KViQDbRaYtMvv7ntSfq6Hi"}'
    );

    -- MSP430
    INSERT INTO products (name, slug, sku, description, brand_id, category_id, base_price, stock_quantity, specifications, images)
    VALUES (
        'MSP430G2553IN20', 
        'msp430g2553in20', 
        'UC-MCU-TI-7721', 
        'Ultra-low-power 16-bit RISC MCU, 16KB Flash, 512B RAM.', 
        ti_id, 
        mcu_id, 
        2.85, 
        12500, 
        '{"Core": "MSP430", "Speed": "16 MHz", "Flash": "16 KB"}'::jsonb,
        '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDU5Gfqc1-nmo5P5QZuFryGUBJebFsrbNBYjoapqcbisUJVHWWVyCZ42E2SfwpcA7LVMLg2bgMr7CcyyFYXhOVtdbf7vdaUW0GvOzuqQSdnpwFXqvVaK6bQ7u8l9OEfgarlJpUt8oskufD_6pKFgclpRYXW5WiVnmVsbGnUEjiF_m4F28qZaekzzZSWPzAHDEPD4C3dbTGYi4T9o1t0reL15FMHFBcCq-m1-laM_OLnrGzdpjNmyZlriDC94Jlqf0pcMNvvPrLQFnwV"}'
    );
END $$;
