'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ChevronLeft, Briefcase, User, MapPin, UserPlus } from 'lucide-react';
import Link from 'next/link';

const caseSchema = z.object({
  bank_id: z.string().min(1, 'Bank is required'),
  application_id: z.string().min(1, 'Application ID is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  property_type: z.string().min(1, 'Property type is required'),
  product_type: z.string().min(1, 'Product type is required'),
  assigned_engineer_id: z.string().optional(),
});

type CaseFormValues = z.infer<typeof caseSchema>;

export default function NewCasePage() {
  const router = useRouter();
  const [banks, setBanks] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);

  useEffect(() => {
    fetchFormData();
  }, []);

  async function fetchFormData() {
    try {
      const [banksRes, engRes] = await Promise.all([
        supabase.from('banks').select('id, name'),
        supabase.from('users').select('id, full_name').eq('role', 'engineer')
      ]);
      
      setBanks(banksRes.data || []);
      setEngineers(engRes.data || []);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      city: 'Ahmedabad',
    },
  });

  const onSubmit = async (data: CaseFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('cases').insert([{
        bank_id: data.bank_id,
        application_id: data.application_id,
        applicant_name: data.applicant_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        property_type: data.property_type,
        product_type: data.product_type,
        assigned_engineer_id: data.assigned_engineer_id || null,
        status: data.assigned_engineer_id ? 'ALLOCATED' : 'PENDING'
      }]);

      if (error) throw error;
      router.push('/admin/cases');
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please check if RLS is disabled or you have permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bankOptions = banks.map(b => ({ label: b.name, value: b.id }));

  const propertyOptions = [
    { label: 'Flat / Apartment', value: 'flat' },
    { label: 'Independent House', value: 'house' },
    { label: 'Plot / Land', value: 'plot' },
    { label: 'Commercial Office', value: 'office' },
    { label: 'Shop', value: 'shop' },
  ];

  const productOptions = [
    { label: 'Home Loan', value: 'home_loan' },
    { label: 'LAP (Loan Against Property)', value: 'lap' },
    { label: 'Balance Transfer', value: 'bt' },
    { label: 'Mortgage', value: 'mortgage' },
  ];

  const engineerOptions = engineers.map(e => ({ label: e.full_name, value: e.id }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/cases" 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Case</h2>
            <p className="text-gray-500 dark:text-gray-400">Enter property valuation request details.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Bank Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Bank Details</h3>
            </div>
            <Select
              label="Select Bank"
              options={bankOptions}
              {...register('bank_id')}
              error={errors.bank_id?.message}
            />
            <Input
              label="Application / Reference ID"
              placeholder="e.g. HDFC-889201"
              {...register('application_id')}
              error={errors.application_id?.message}
            />
            <Select
              label="Product Type"
              options={productOptions}
              {...register('product_type')}
              error={errors.product_type?.message}
            />
          </div>

          {/* Section: Applicant Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Applicant Details</h3>
            </div>
            <Input
              label="Applicant Full Name"
              placeholder="e.g. Rajesh Kumar"
              {...register('applicant_name')}
              error={errors.applicant_name?.message}
            />
            <Input
              label="Contact Number"
              placeholder="e.g. 9876543210"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Select
              label="Property Type"
              options={propertyOptions}
              {...register('property_type')}
              error={errors.property_type?.message}
            />
          </div>
        </div>

        {/* Section: Property Address */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Property Address</h3>
          </div>
          <Input
            label="Full Address"
            placeholder="House no, Street, Landmark..."
            {...register('address')}
            error={errors.address?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="Pincode"
              placeholder="380015"
              {...register('pincode')}
              error={errors.pincode?.message}
            />
          </div>
        </div>

        {/* Section: Allocation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <UserPlus className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Allocation</h3>
          </div>
          <Select
            label="Assign Field Engineer (Optional)"
            options={engineerOptions}
            {...register('assigned_engineer_id')}
            error={errors.assigned_engineer_id?.message}
          />
          <p className="text-xs text-gray-500">You can assign this case later from the dashboard if needed.</p>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/cases">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="px-8"
          >
            Create Case & Notify Engineer
          </Button>
        </div>
      </form>
    </div>
  );
}
