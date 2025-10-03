-- ============================================
-- PRE-EXECUTION CLEANUP (Safe Drop Order)
-- ============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_dim_entity_modified_date ON dim_entity;
DROP TRIGGER IF EXISTS update_fact_address_modified_date ON fact_address;
DROP TRIGGER IF EXISTS update_fact_contact_modified_date ON fact_contact;
DROP TRIGGER IF EXISTS update_fact_job_modified_date ON fact_job;
DROP TRIGGER IF EXISTS update_fact_bank_modified_date ON fact_bank;
DROP TRIGGER IF EXISTS update_fact_finance_modified_date ON fact_finance;
DROP TRIGGER IF EXISTS update_fact_guarantor_modified_date ON fact_guarantor;
DROP TRIGGER IF EXISTS update_bridge_entity_loan_modified_date ON bridge_entity_loan;
DROP TRIGGER IF EXISTS entity_search_vector_trigger ON dim_entity;

-- Drop bridge and fact tables (they may reference dim_entity)
DROP TABLE IF EXISTS bridge_entity_loan CASCADE;
DROP TABLE IF EXISTS fact_guarantor CASCADE;
DROP TABLE IF EXISTS fact_finance CASCADE;
DROP TABLE IF EXISTS fact_bank CASCADE;
DROP TABLE IF EXISTS fact_job CASCADE;
DROP TABLE IF EXISTS fact_contact CASCADE;
DROP TABLE IF EXISTS fact_address CASCADE;

-- Drop dimension table
DROP TABLE IF EXISTS dim_entity CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_modified_date_column;
DROP FUNCTION IF EXISTS entity_search_vector_update;

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COMMON FUNCTION FOR modified_date AUTO-REFRESH
-- ============================================
CREATE OR REPLACE FUNCTION update_modified_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_date = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. DIMENSION TABLE
-- ============================================
CREATE TABLE dim_entity (
                            entity_key VARCHAR(255) PRIMARY KEY,
                            fiscal_code VARCHAR(16) NOT NULL,
                            source_system VARCHAR(100),
                            name VARCHAR(255),
                            is_company BOOLEAN DEFAULT FALSE,
                            gender VARCHAR(10),
                            date_of_birth DATE,
                            country_of_birth VARCHAR(100),
                            region_of_birth VARCHAR(100),
                            province_of_birth VARCHAR(100),
                            city_of_birth VARCHAR(100),
                            is_deceased BOOLEAN DEFAULT FALSE,
                            date_of_death DATE,
                            entity_notes TEXT,
                            created_date TIMESTAMP DEFAULT NOW(),
                            modified_date TIMESTAMP DEFAULT NOW(),
                            extracted_date TIMESTAMP,
                            search_vector tsvector
);

-- Disable RLS if using Supabase
ALTER TABLE dim_entity DISABLE ROW LEVEL SECURITY;

-- Trigger for modified_date
CREATE TRIGGER update_dim_entity_modified_date
    BEFORE UPDATE ON dim_entity
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- ============================================
-- 2. FACT TABLES
-- ============================================

-- 2.1: Addresses
CREATE TABLE fact_address (
                              address_key VARCHAR(255) PRIMARY KEY,
                              entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                              fiscal_code VARCHAR(16) NOT NULL,
                              source_system VARCHAR(100),
                              origin_province VARCHAR(100),
                              origin_city VARCHAR(100),
                              origin_street VARCHAR(255),
                              address_type VARCHAR(50),
                              street VARCHAR(255),
                              locality VARCHAR(100),
                              city VARCHAR(100),
                              province VARCHAR(100),
                              region VARCHAR(100),
                              postcode VARCHAR(20),
                              country VARCHAR(100),
                              similar_score NUMERIC(5,2),
                              address_notes TEXT,
                              created_date TIMESTAMP DEFAULT NOW(),
                              modified_date TIMESTAMP DEFAULT NOW(),
                              extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_address_modified_date
    BEFORE UPDATE ON fact_address
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.2: Contacts
CREATE TABLE fact_contact (
                              contact_key VARCHAR(255) PRIMARY KEY,
                              entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                              fiscal_code VARCHAR(16) NOT NULL,
                              source_system VARCHAR(100),
                              email VARCHAR(255),
                              is_pec BOOLEAN DEFAULT FALSE,
                              is_verified BOOLEAN DEFAULT FALSE,
                              phone_number VARCHAR(100),
                              created_date TIMESTAMP DEFAULT NOW(),
                              modified_date TIMESTAMP DEFAULT NOW(),
                              extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_contact_modified_date
    BEFORE UPDATE ON fact_contact
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.3: Jobs
CREATE TABLE fact_job (
                          job_key VARCHAR(255) PRIMARY KEY,
                          entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                          fiscal_code VARCHAR(16) NOT NULL,
                          source_system VARCHAR(100),
                          job_position VARCHAR(255),
                          job_employer_name VARCHAR(255),
                          job_start_date VARCHAR(255),
                          job_end_date VARCHAR(255),
                          job_employer_phone VARCHAR(50),
                          job_employer_fax VARCHAR(50),
                          job_pension_category VARCHAR(100),
                          job_employer_tax_code VARCHAR(50),
                          job_employer_vat_number VARCHAR(50),
                          job_reference VARCHAR(255),
                          job_monthly_income NUMERIC(15,2),
                          job_income_range VARCHAR(50),
                          job_work_activity_notes TEXT,
                          job_legal_street_type VARCHAR(50),
                          job_legal_street VARCHAR(255),
                          job_legal_address VARCHAR(500),
                          job_legal_street_number VARCHAR(20),
                          job_legal_city VARCHAR(100),
                          job_legal_province VARCHAR(100),
                          job_legal_postcode VARCHAR(20),
                          job_operation_street_type VARCHAR(50),
                          job_operation_street VARCHAR(255),
                          job_operation_address VARCHAR(500),
                          job_operation_street_number VARCHAR(20),
                          job_operation_city VARCHAR(100),
                          job_operation_province VARCHAR(100),
                          job_operation_postcode VARCHAR(20),
                          created_date TIMESTAMP DEFAULT NOW(),
                          modified_date TIMESTAMP DEFAULT NOW(),
                          extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_job_modified_date
    BEFORE UPDATE ON fact_job
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.4: Banks
CREATE TABLE fact_bank (
                           bank_key VARCHAR(255) PRIMARY KEY,
                           entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                           fiscal_code VARCHAR(16) NOT NULL,
                           source_system VARCHAR(100),
                           bank_abi VARCHAR(50),
                           bank_cab VARCHAR(50),
                           bank_name VARCHAR(255),
                           account_number VARCHAR(50),
                           created_date TIMESTAMP DEFAULT NOW(),
                           modified_date TIMESTAMP DEFAULT NOW(),
                           extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_bank_modified_date
    BEFORE UPDATE ON fact_bank
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.5: Finance
CREATE TABLE fact_finance (
                              finance_key VARCHAR(255) PRIMARY KEY,
                              entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                              fiscal_code VARCHAR(16) NOT NULL,
                              source_system VARCHAR(100),
                              finance_position VARCHAR(100),
                              finance_supplier_evaluation VARCHAR(100),
                              finance_ongoing_transfers TEXT,
                              finance_transfer_amount NUMERIC(15,2),
                              finance_transfer_notes TEXT,
                              finance_transfer_expiry TEXT,
                              finance_ongoing_garnishments TEXT,
                              finance_garnishment_amount NUMERIC(15,2),
                              finance_garnishment_notes TEXT,
                              finance_garnishment_expiry TEXT,
                              finance_bank_account VARCHAR(50),
                              created_date TIMESTAMP DEFAULT NOW(),
                              modified_date TIMESTAMP DEFAULT NOW(),
                              extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_finance_modified_date
    BEFORE UPDATE ON fact_finance
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.6: Guarantors
CREATE TABLE fact_guarantor (
                                guarantor_key VARCHAR(255) PRIMARY KEY,
                                guarantor_entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                                guarantor_fiscal_code VARCHAR(16) NOT NULL,
                                guaranteed_entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                                guaranteed_fiscal_code VARCHAR(16) NOT NULL,
                                loan_key VARCHAR(255),
                                source_system VARCHAR(100),
                                guarantee_amount NUMERIC(15,2),
                                guarantee_start_date DATE,
                                guarantee_end_date DATE,
                                created_date TIMESTAMP DEFAULT NOW(),
                                modified_date TIMESTAMP DEFAULT NOW(),
                                extracted_date TIMESTAMP
);

CREATE TRIGGER update_fact_guarantor_modified_date
    BEFORE UPDATE ON fact_guarantor
    FOR EACH ROW EXECUTE FUNCTION update_modified_date_column();

-- 2.7: Bridge Entity Loan (converted from BigQuery to PostgreSQL)
CREATE TABLE bridge_entity_loan (
                                    entity_loan_key VARCHAR(255) PRIMARY KEY,
                                    entity_key VARCHAR(255) NOT NULL REFERENCES dim_entity(entity_key) ON DELETE CASCADE,
                                    loan_key VARCHAR(255),
                                    fiscal_code VARCHAR(16),
                                    source_system VARCHAR(100),
                                    loan_id VARCHAR(255),
                                    borrower_type_id INTEGER,
                                    borrower_type_name VARCHAR(255),
                                    borrower_id INTEGER,
                                    record_id VARCHAR(255),
                                    file VARCHAR(255),
                                    sheet VARCHAR(255),
                                    is_active BOOLEAN DEFAULT TRUE,
                                    created_date TIMESTAMP,
                                    modified_date TIMESTAMP,
                                    extracted_date TIMESTAMP
);

-- ============================================
-- 3. INDEXES
-- ============================================

-- Entity indexes
CREATE INDEX idx_entity_fiscal_code ON dim_entity(fiscal_code);
CREATE INDEX idx_entity_name ON dim_entity(name);
CREATE INDEX idx_entity_name_trgm ON dim_entity USING gin(name gin_trgm_ops);
CREATE INDEX idx_entity_created_date ON dim_entity(created_date DESC);
CREATE INDEX idx_entity_is_company ON dim_entity(is_company);

-- Address indexes
CREATE INDEX idx_address_entity_key ON fact_address(entity_key);
CREATE INDEX idx_address_fiscal_code ON fact_address(fiscal_code);
CREATE INDEX idx_address_city ON fact_address(city);
CREATE INDEX idx_address_province ON fact_address(province);
CREATE INDEX idx_address_type ON fact_address(address_type);
CREATE INDEX idx_address_fc_type ON fact_address(fiscal_code, address_type);

-- Contact indexes
CREATE INDEX idx_contact_entity_key ON fact_contact(entity_key);
CREATE INDEX idx_contact_fiscal_code ON fact_contact(fiscal_code);
CREATE INDEX idx_contact_email ON fact_contact(email);
CREATE INDEX idx_contact_phone ON fact_contact(phone_number);

-- Job indexes
CREATE INDEX idx_job_entity_key ON fact_job(entity_key);
CREATE INDEX idx_job_fiscal_code ON fact_job(fiscal_code);
CREATE INDEX idx_job_employer ON fact_job(job_employer_name);
CREATE INDEX idx_job_end_date ON fact_job(job_end_date);
CREATE INDEX idx_job_active ON fact_job(fiscal_code, job_end_date) WHERE job_end_date IS NULL;

-- Bank indexes
CREATE INDEX idx_bank_entity_key ON fact_bank(entity_key);
CREATE INDEX idx_bank_fiscal_code ON fact_bank(fiscal_code);
CREATE INDEX idx_bank_abi ON fact_bank(bank_abi);
CREATE INDEX idx_bank_name ON fact_bank(bank_name);

-- Finance indexes
CREATE INDEX idx_finance_entity_key ON fact_finance(entity_key);
CREATE INDEX idx_finance_fiscal_code ON fact_finance(fiscal_code);
CREATE INDEX idx_finance_garnishments ON fact_finance(fiscal_code, finance_ongoing_garnishments)
    WHERE finance_ongoing_garnishments IS NOT NULL AND finance_ongoing_garnishments <> '';
CREATE INDEX idx_finance_transfers ON fact_finance(fiscal_code, finance_ongoing_transfers)
    WHERE finance_ongoing_transfers IS NOT NULL AND finance_ongoing_transfers <> '';

-- Guarantor indexes
CREATE INDEX idx_guarantor_guarantor_key ON fact_guarantor(guarantor_entity_key);
CREATE INDEX idx_guarantor_guaranteed_key ON fact_guarantor(guaranteed_entity_key);
CREATE INDEX idx_guarantor_guarantor_fc ON fact_guarantor(guarantor_fiscal_code);
CREATE INDEX idx_guarantor_guaranteed_fc ON fact_guarantor(guaranteed_fiscal_code);
CREATE INDEX idx_guarantor_loan ON fact_guarantor(loan_key);

-- Bridge Entity Loan indexes
CREATE INDEX idx_bridge_entity_key ON bridge_entity_loan(entity_key);
CREATE INDEX idx_bridge_loan_key ON bridge_entity_loan(loan_key);
CREATE INDEX idx_bridge_fiscal_code ON bridge_entity_loan(fiscal_code);
CREATE INDEX idx_bridge_loan_id ON bridge_entity_loan(loan_id);
CREATE INDEX idx_bridge_is_active ON bridge_entity_loan(is_active) WHERE is_active = TRUE;

-- ============================================
-- 4. FULL-TEXT SEARCH SETUP
-- ============================================

-- Function to update search vector
CREATE OR REPLACE FUNCTION entity_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('italian',
        coalesce(NEW.name, '') || ' ' ||
        coalesce(NEW.fiscal_code, '') || ' ' ||
        coalesce(NEW.city_of_birth, '') || ' ' ||
        coalesce(NEW.region_of_birth, '')
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for search vector
CREATE TRIGGER entity_search_vector_trigger
    BEFORE INSERT OR UPDATE ON dim_entity
                         FOR EACH ROW EXECUTE FUNCTION entity_search_vector_update();

-- Index for full-text search
CREATE INDEX idx_entity_search_vector ON dim_entity USING gin(search_vector);

-- ============================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE dim_entity IS 'Dimension table storing entity (person/company) master data';
COMMENT ON TABLE fact_address IS 'Fact table for entity addresses';
COMMENT ON TABLE fact_contact IS 'Fact table for entity contact information';
COMMENT ON TABLE fact_job IS 'Fact table for entity employment information';
COMMENT ON TABLE fact_bank IS 'Fact table for entity banking information';
COMMENT ON TABLE fact_finance IS 'Fact table for entity financial information';
COMMENT ON TABLE fact_guarantor IS 'Fact table for guarantor relationships';
COMMENT ON TABLE bridge_entity_loan IS 'Bridge table linking entities to loans';