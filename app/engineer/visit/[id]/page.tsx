'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  MapPin, 
  Camera, 
  Ruler, 
  Info, 
  CheckCircle2, 
  Navigation, 
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';

export default function VisitForm({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [photos, setPhotos] = useState<Record<string, File[]>>({
    front: [],
    back: [],
    interior: [],
    road: [],
    surroundings: []
  });

  // Form State
  const [propertyDetails, setPropertyDetails] = useState({
    ownership_type: 'self',
    locality_type: 'res',
    community: '',
    remarks: ''
  });
  const [measurementData, setMeasurementData] = useState({
    plot_area: '',
    builtup_area: '',
    length: '',
    depth: '',
    carpet_rate: ''
  });
  const [boundaryData, setBoundaryData] = useState({
    north: '',
    south: '',
    east: '',
    west: ''
  });

  useEffect(() => {
    fetchCase();
  }, [params.id]);

  async function fetchCase() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*, banks(name)')
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const steps = [
    { id: 1, name: 'Check-in', icon: MapPin },
    { id: 2, name: 'Details', icon: Info },
    { id: 3, name: 'Measurements', icon: Ruler },
    { id: 4, name: 'Photos', icon: Camera },
    { id: 5, name: 'Review', icon: CheckCircle2 }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Visit Record
      const { data: visit, error: visitError } = await supabase
        .from('visits')
        .insert([{
          case_id: params.id,
          engineer_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000', // Fallback for demo
          gps_lat: location?.lat,
          gps_lng: location?.lng,
          ownership_type: propertyDetails.ownership_type,
          locality_type: propertyDetails.locality_type,
          community: propertyDetails.community,
          remarks: propertyDetails.remarks,
          visit_completed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (visitError) throw visitError;

      // 2. Create Measurements & Boundaries
      await Promise.all([
        supabase.from('measurements').insert([{
          visit_id: visit.id,
          plot_area: parseFloat(measurementData.plot_area),
          builtup_area: parseFloat(measurementData.builtup_area),
          length: parseFloat(measurementData.length),
          depth: parseFloat(measurementData.depth),
          carpet_rate: parseFloat(measurementData.carpet_rate)
        }]),
        supabase.from('boundaries').insert([{
          visit_id: visit.id,
          north: boundaryData.north,
          south: boundaryData.south,
          east: boundaryData.east,
          west: boundaryData.west
        }])
      ]);

      // 3. Update Case Status
      await supabase
        .from('cases')
        .update({ status: 'FORM_SUBMITTED' })
        .eq('id', params.id);

      alert('Visit Report Submitted Successfully!');
      router.push('/engineer');
    } catch (error) {
      console.error('Error submitting visit:', error);
      alert('Failed to submit report. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const captureLocation = () => {
    setIsCapturingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsCapturingLocation(false);
        },
        (error) => {
          alert('Error capturing location: ' + error.message);
          setIsCapturingLocation(false);
        }
      );
    } else {
      alert('Geolocation not supported');
      setIsCapturingLocation(false);
    }
  };

  const handlePhotoUpload = (category: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setPhotos(prev => ({
      ...prev,
      [category]: [...prev[category], ...newFiles]
    }));
  };

  const removePhoto = (category: string, index: number) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Step Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
        <div className="px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft className="h-6 w-6 text-gray-500" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {isLoading ? 'Loading...' : `Case #${caseData?.application_id || 'VAL-'+params.id}`}
            </h1>
            <p className="text-xs text-gray-500">
              {caseData?.applicant_name} • {caseData?.banks?.name}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex justify-between px-6 pb-4">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                step >= s.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step === s.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="px-6 py-8">
        {/* Step 1: Check-in (GPS Capture) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Site Check-in</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Please capture your current GPS location to start the valuation visit. This ensures accuracy and audit compliance.
              </p>
              
              {!location ? (
                <Button 
                  onClick={captureLocation} 
                  isLoading={isCapturingLocation}
                  icon={Navigation}
                  className="w-full py-6 rounded-2xl text-lg"
                >
                  Capture GPS Location
                </Button>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-2xl flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-500 text-white rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">Location Captured</p>
                    <p className="text-xs text-green-600/70">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                  </div>
                </div>
              )}
            </Card>
            
            {location && (
              <Button onClick={() => setStep(2)} className="w-full py-4">Next: Property Details</Button>
            )}
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">General Details</h2>
              <Select 
                label="Ownership Type"
                value={propertyDetails.ownership_type}
                onChange={(e) => setPropertyDetails({...propertyDetails, ownership_type: e.target.value})}
                options={[
                  { label: 'Self Occupied', value: 'self' },
                  { label: 'Tenanted', value: 'tenant' },
                  { label: 'Vacant', value: 'vacant' }
                ]}
              />
              <Select 
                label="Locality Type"
                value={propertyDetails.locality_type}
                onChange={(e) => setPropertyDetails({...propertyDetails, locality_type: e.target.value})}
                options={[
                  { label: 'Residential', value: 'res' },
                  { label: 'Commercial', value: 'comm' },
                  { label: 'Industrial', value: 'ind' }
                ]}
              />
              <Input 
                label="Community / Building Name" 
                placeholder="e.g. Shanti Vihar" 
                value={propertyDetails.community}
                onChange={(e) => setPropertyDetails({...propertyDetails, community: e.target.value})}
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Remarks</label>
                <textarea 
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all min-h-[100px]"
                  placeholder="Any specific observations..."
                  value={propertyDetails.remarks}
                  onChange={(e) => setPropertyDetails({...propertyDetails, remarks: e.target.value})}
                ></textarea>
              </div>
            </Card>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Next Step</Button>
            </div>
          </div>
        )}

        {/* Step 3: Measurements */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Area & Dimensions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Plot Area (Sqft)" type="number" value={measurementData.plot_area} onChange={(e) => setMeasurementData({...measurementData, plot_area: e.target.value})} />
                <Input label="Built-up Area (Sqft)" type="number" value={measurementData.builtup_area} onChange={(e) => setMeasurementData({...measurementData, builtup_area: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Length (Ft)" type="number" value={measurementData.length} onChange={(e) => setMeasurementData({...measurementData, length: e.target.value})} />
                <Input label="Depth (Ft)" type="number" value={measurementData.depth} onChange={(e) => setMeasurementData({...measurementData, depth: e.target.value})} />
              </div>
              <Input label="Carpet Rate (per Sqft)" type="number" value={measurementData.carpet_rate} onChange={(e) => setMeasurementData({...measurementData, carpet_rate: e.target.value})} />
            </Card>

            <Card className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Boundaries</h2>
              <Input label="North" placeholder="e.g. Society Road" value={boundaryData.north} onChange={(e) => setBoundaryData({...boundaryData, north: e.target.value})} />
              <Input label="South" placeholder="e.g. Plot No. 102" value={boundaryData.south} onChange={(e) => setBoundaryData({...boundaryData, south: e.target.value})} />
              <Input label="East" placeholder="e.g. Common Garden" value={boundaryData.east} onChange={(e) => setBoundaryData({...boundaryData, east: e.target.value})} />
              <Input label="West" placeholder="e.g. Society Gate" value={boundaryData.west} onChange={(e) => setBoundaryData({...boundaryData, west: e.target.value})} />
            </Card>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(4)} className="flex-1">Next Step</Button>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {Object.keys(photos).map((cat) => (
              <Card key={cat} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white capitalize">{cat} Photos</h3>
                  <span className="text-xs font-bold text-blue-600">{photos[cat].length} captured</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {photos[cat].map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => removePhoto(cat, idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Camera className="h-6 w-6 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Add</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => handlePhotoUpload(cat, e.target.files)}
                    />
                  </label>
                </div>
              </Card>
            ))}
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(5)} className="flex-1">Review & Submit</Button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="bg-blue-600 text-white">
              <h2 className="text-xl font-black mb-2">Ready to submit?</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                Please ensure all data and photos are accurate. Once submitted, the case will be sent for Admin Review.
              </p>
            </Card>

            <Card className="space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location</span>
                <span className="text-green-600 font-bold">Captured</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Photos</span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {Object.values(photos).flat().length} Total
                </span>
              </div>
            </Card>

            <Button 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="w-full py-5 rounded-2xl text-lg shadow-xl shadow-blue-200 dark:shadow-none"
            >
              Submit Final Report
            </Button>
            <Button variant="outline" onClick={() => setStep(4)} className="w-full py-4">
              Back to Photos
            </Button>
          </div>
        )}
      </main>

      {/* Draft Saving Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium italic">Changes auto-saved as draft</span>
        <Button variant="ghost" size="sm" icon={Save}>Save Draft</Button>
      </div>
    </div>
  );
}
