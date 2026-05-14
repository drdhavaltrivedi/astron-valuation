'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  Building2, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle,
  Download,
  Eye,
  Loader2,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import dynamic from 'next/dynamic';
import ICICITemplate from '@/components/reports/ICICITemplate';
import HDFCTemplate from '@/components/reports/HDFCTemplate';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function CaseDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'measurements' | 'queries'>('details');
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaseDetails();
  }, [params.id]);

  async function fetchCaseDetails() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          banks (*),
          users:assigned_engineer_id (*),
          visits (
            *,
            measurements (*),
            boundaries (*),
            photos (*)
          ),
          tickets (*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case details:', error);
    }
  }

  async function updateStatus(newStatus: string) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus })
        .eq('id', params.id);
      
      if (error) throw error;
      alert(`Case ${newStatus.toLowerCase()} successfully.`);
      router.push('/admin/cases');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin" /></div>;
  if (!caseData) return <div>Case not found</div>;

  const visit = caseData.visits?.[0];
  const measurements = visit?.measurements?.[0];
  const boundaries = visit?.boundaries?.[0];

  const Template = caseData.banks?.name === 'HDFC Bank' ? HDFCTemplate : ICICITemplate;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case Review: VAL-{caseData.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase">
                {caseData.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">• {caseData.date}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            icon={XCircle} 
            className="text-red-600 border-red-100 hover:bg-red-50"
            onClick={() => updateStatus('REJECTED')}
          >
            Reject
          </Button>
          
          <PDFDownloadLink
            document={
              <Template 
                data={{
                  caseId: `VAL-${caseData.id}`,
                  applicant: caseData.applicant_name,
                  bank: caseData.banks?.name,
                  address: caseData.address,
                  propertyType: caseData.property_type,
                  visitDate: new Date(caseData.created_at).toLocaleDateString(),
                  engineer: caseData.users?.full_name,
                  measurements: {
                    plotArea: measurements?.plot_area,
                    builtupArea: measurements?.builtup_area,
                    rate: measurements?.carpet_rate
                  },
                  remarks: visit?.remarks,
                  photos: visit?.photos || []
                }} 
              />
            }
            fileName={`Valuation_Report_${caseData.applicant_name}.pdf`}
          >
            {({ loading }) => (
              <Button 
                icon={loading ? Loader2 : CheckCircle} 
                disabled={loading}
                onClick={() => updateStatus('COMPLETED')}
              >
                {loading ? 'Generating...' : 'Approve & Generate Report'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {(['details', 'photos', 'measurements', 'queries'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold capitalize transition-all border-b-2 ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-300">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Property Submission</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Ownership Type</p>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">{visit?.ownership_type || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Locality Type</p>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">{visit?.locality_type || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Community / Building</p>
                      <p className="font-bold text-gray-900 dark:text-white">{visit?.community || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">GPS Verification</p>
                      {visit?.gps_lat ? (
                        <p className="font-bold text-green-600 flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {visit.gps_lat.toFixed(4)}, {visit.gps_lng.toFixed(4)}
                        </p>
                      ) : (
                        <p className="text-red-500 font-bold text-xs">Not Captured</p>
                      )}
                    </div>
                  </div>
                </Card>
 
                <Card>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Engineer Remarks</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{visit?.remarks || 'No remarks provided.'}"
                  </p>
                </Card>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-[10px] text-white font-bold rounded-lg uppercase">
                      Front View
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <Button variant="outline" size="sm" icon={Eye} className="bg-white/90 border-none shadow-xl">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'measurements' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Parameter</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Plot Area</td>
                        <td className="px-4 py-3 text-sm font-bold">{measurements?.plot_area || 0} Sqft</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Built-up Area</td>
                        <td className="px-4 py-3 text-sm font-bold">{measurements?.builtup_area || 0} Sqft</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Carpet Rate</td>
                        <td className="px-4 py-3 text-sm font-bold">₹ {measurements?.carpet_rate || 0} / Sqft</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'queries' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Internal Queries</h3>
                  <Button size="sm" variant="outline" icon={Plus}>Raise New Query</Button>
                </div>
                
                {caseData.tickets?.map((q: any) => (
                  <Card key={q.id} className="p-4 border-l-4 border-l-blue-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${q.status === 'open' ? 'bg-red-500' : 'bg-green-500'}`} />
                        <h4 className="font-bold text-gray-900 dark:text-white">{q.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{q.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{q.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        q.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {q.priority} Priority
                      </span>
                      <Button variant="ghost" size="sm">View Conversation</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <h3 className="font-black uppercase tracking-widest text-[10px] opacity-70 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white" icon={Download}>
                Export Raw Data
              </Button>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white" icon={FileText}>
                Preview Bank Form
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Case Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Building2 className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Bank</p>
                  <p className="text-sm font-bold">{caseData.bank}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Field Engineer</p>
                  <p className="text-sm font-bold">{caseData.engineer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Created On</p>
                  <p className="text-sm font-bold">{caseData.date}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
