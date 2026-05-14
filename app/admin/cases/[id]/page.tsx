'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
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

  const caseData = {
    id: params.id,
    applicant: 'Rajesh Kumar',
    bank: 'ICICI Bank',
    status: 'FORM_SUBMITTED',
    date: '14 May 2026',
    address: '102, Shanti Vihar Apartments, Satellite, Ahmedabad',
    engineer: 'Amit Sharma',
    propertyType: 'Residential Flat',
    visitDetails: {
      checkIn: '10:30 AM',
      location: '23.0225° N, 72.5714° E',
      ownership: 'Self Occupied',
      locality: 'Residential'
    },
    measurements: {
      plotArea: '1200',
      builtupArea: '1800',
      rate: '5500'
    },
    remarks: 'Property is in well-maintained condition. Located in a prime residential area with easy access to main road. No visible structural issues observed.',
    photos: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400', category: 'Front' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', category: 'Interior' }
    ],
    queries: [
      { id: '1', title: 'Road photo missing', description: 'Please provide a clear photo of the approach road.', status: 'open', priority: 'high', date: '14 May' },
      { id: '2', title: 'Confirm Built-up Area', description: 'The area seems higher than usual for this society.', status: 'resolved', priority: 'medium', date: '13 May' },
    ]
  };

  const Template = caseData.bank === 'HDFC Bank' ? HDFCTemplate : ICICITemplate;

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
          <Button variant="outline" icon={XCircle} className="text-red-600 border-red-100 hover:bg-red-50">Reject</Button>
          
          <PDFDownloadLink
            document={
              <Template 
                data={{
                  caseId: `VAL-${caseData.id}`,
                  applicant: caseData.applicant,
                  bank: caseData.bank,
                  address: caseData.address,
                  propertyType: caseData.propertyType,
                  visitDate: caseData.date,
                  engineer: caseData.engineer,
                  measurements: caseData.measurements,
                  remarks: caseData.remarks,
                  photos: caseData.photos
                }} 
              />
            }
            fileName={`Valuation_Report_${caseData.applicant}.pdf`}
          >
            {({ loading }) => (
              <Button icon={loading ? Loader2 : CheckCircle} disabled={loading}>
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
                      <p className="font-bold text-gray-900 dark:text-white">{caseData.visitDetails.ownership}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Locality Type</p>
                      <p className="font-bold text-gray-900 dark:text-white">{caseData.visitDetails.locality}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Check-in Time</p>
                      <p className="font-bold text-gray-900 dark:text-white">{caseData.visitDetails.checkIn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">GPS Verification</p>
                      <p className="font-bold text-green-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Verified Location
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Engineer Remarks</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "Property is in well-maintained condition. Located in a prime residential area with easy access to main road. No visible structural issues observed."
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
                        <td className="px-4 py-3 text-sm font-bold">1,200 Sqft</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Built-up Area</td>
                        <td className="px-4 py-3 text-sm font-bold">1,800 Sqft</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">Carpet Rate</td>
                        <td className="px-4 py-3 text-sm font-bold">₹ 5,500 / Sqft</td>
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
                
                {caseData.queries.map((q) => (
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
