-- Seed 10 sample cases for Ahmedabad
DO $$
DECLARE
    bank_ids UUID[];
    engineer_ids UUID[];
BEGIN
    -- Get available bank IDs
    SELECT ARRAY_AGG(id) INTO bank_ids FROM banks;
    -- Get available engineer IDs
    SELECT ARRAY_AGG(id) INTO engineer_ids FROM users WHERE role = 'engineer';

    -- Insert 10 cases
    INSERT INTO cases (bank_id, application_id, applicant_name, phone, address, city, pincode, property_type, product_type, assigned_engineer_id, status)
    VALUES
    (bank_ids[1], 'APP-1001', 'Rajesh Patel', '9876543210', 'A-401, Shivalik Residency, Prahlad Nagar', 'Ahmedabad', '380015', 'flat', 'home_loan', engineer_ids[1], 'ALLOCATED'),
    (bank_ids[2], 'APP-1002', 'Suresh Gupta', '9898989898', 'Block B, Satyamev Royal, Chandkheda', 'Ahmedabad', '382424', 'flat', 'lap', engineer_ids[2], 'ALLOCATED'),
    (bank_ids[3], 'APP-1003', 'Anita Sharma', '9723456789', '12, Gokul Row House, Satellite', 'Ahmedabad', '380015', 'house', 'home_loan', engineer_ids[1], 'NEW'),
    (bank_ids[4], 'APP-1004', 'Vikram Singh', '9988776655', 'Shop 45, Alpha One Mall, Vastrapur', 'Ahmedabad', '380054', 'shop', 'mortgage', engineer_ids[2], 'VISIT_STARTED'),
    (bank_ids[1], 'APP-1005', 'Meera Desai', '9638527410', 'Plot 89, Green Valley Bungalows, Thaltej', 'Ahmedabad', '380059', 'plot', 'home_loan', engineer_ids[1], 'FORM_SUBMITTED'),
    (bank_ids[2], 'APP-1006', 'Amit Shah', '9512345678', 'C-102, Titanium City Center, Anand Nagar', 'Ahmedabad', '380015', 'office', 'lap', engineer_ids[2], 'NEW'),
    (bank_ids[3], 'APP-1007', 'Priya Mehta', '9426789012', '7, Shivam Duplex, Bopal', 'Ahmedabad', '380058', 'house', 'home_loan', engineer_ids[1], 'ALLOCATED'),
    (bank_ids[4], 'APP-1008', 'Dhaval Trivedi', '9099909990', 'Skyline Apartments, Nikol', 'Ahmedabad', '382350', 'flat', 'mortgage', engineer_ids[2], 'COMPLETED'),
    (bank_ids[1], 'APP-1009', 'Sanjay Rathod', '9900881122', 'Indraprastha Tower, Drive-in Road', 'Ahmedabad', '380052', 'flat', 'bt', engineer_ids[1], 'NEW'),
    (bank_ids[2], 'APP-1010', 'Deepak Varma', '9822334455', 'Gajanand Society, Maninagar', 'Ahmedabad', '380008', 'house', 'home_loan', engineer_ids[2], 'VISIT_STARTED');
END $$;
