"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Upload, Download, FileSpreadsheet, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

interface Facility {
  facilityId: string;
  facilityName: string;
  district: string;
  ambulancesDeployed: number;
  operationalStatus: "Grounded" | "Operational" | "Partially Operational";
  populationServed: number;
  roadCondition: "Poor" | "Moderate" | "Good";
  priorityTier: "Critical" | "High" | "Medium" | "Low";
}

interface FacilityAnalytics {
  totalFacilities: number;
  priorityDistribution: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  operationalStatusDistribution: {
    Grounded: number;
    Operational: number;
    "Partially Operational": number;
  };
}

interface DatabaseUploadProps {
  onFacilitiesLoaded: (facilities: Facility[], ambulanceCount: number) => void;
  facilities?: Facility[]; // Make facilities optional
}

export function DatabaseUpload({ onFacilitiesLoaded, facilities = [] }: DatabaseUploadProps) {
  const [jsonData, setJsonData] = useState("");
  const [ambulanceCount, setAmbulanceCount] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<FacilityAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState("json");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      // Auto-process Excel files when selected
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        processExcelData(selectedFile);
      }
    }
  };

  const calculateAnalytics = (facilities: Facility[]): FacilityAnalytics => {
    const analytics: FacilityAnalytics = {
      totalFacilities: facilities.length,
      priorityDistribution: {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
      },
      operationalStatusDistribution: {
        Grounded: 0,
        Operational: 0,
        "Partially Operational": 0
      }
    };

    for (const facility of facilities) {
      // Count priority distribution
      if (facility.priorityTier === "Critical") analytics.priorityDistribution.Critical++;
      else if (facility.priorityTier === "High") analytics.priorityDistribution.High++;
      else if (facility.priorityTier === "Medium") analytics.priorityDistribution.Medium++;
      else if (facility.priorityTier === "Low") analytics.priorityDistribution.Low++;
      
      // Count operational status distribution
      if (facility.operationalStatus === "Grounded") analytics.operationalStatusDistribution.Grounded++;
      else if (facility.operationalStatus === "Operational") analytics.operationalStatusDistribution.Operational++;
      else if (facility.operationalStatus === "Partially Operational") analytics.operationalStatusDistribution["Partially Operational"]++;
    }

    return analytics;
  };

  const processJsonData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      if (!Array.isArray(parsed.facilities)) {
        throw new Error("Invalid data format: 'facilities' should be an array");
      }
      
      for (const facility of parsed.facilities) {
        if (!facility.facilityId || !facility.facilityName || !facility.district || 
            !facility.ambulancesDeployed || !facility.operationalStatus || 
            !facility.populationServed || !facility.roadCondition || !facility.priorityTier) {
          throw new Error("Missing required fields in facility data");
        }
      }
      
      const ambulances = parsed.availableAmbulances || ambulanceCount;
      const facilitiesData = parsed.facilities;
      
      // Calculate analytics
      const facilityAnalytics = calculateAnalytics(facilitiesData);
      setAnalytics(facilityAnalytics);
      
      setSuccess(`Successfully loaded and analyzed ${facilitiesData.length} facilities and ${ambulances} ambulances`);
      onFacilitiesLoaded(facilitiesData, ambulances);
      
      setJsonData("");
      setFile(null);
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON data");
    }
  };

  const processExcelData = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const facilities: Facility[] = jsonData.map((row, index) => {
        const facilityId = row["Facility ID"]?.toString() || `excel-${index + 1}`;
        const facilityName = row["Facility Name"] || "";
        const district = row["District"] || "";
        const ambulancesDeployed = parseInt(row["Ambulances Deployed"]) || 0;
        const operationalStatus = row["Operational Status"] || "Grounded";
        const populationServed = parseInt(row["Population Served"]) || 0;
        const roadCondition = row["Road Condition"] || "Poor";
        const priorityTier = row["Priority Tier"] || "Medium";

        // Validate required fields - fixing the missing parenthesis
        if (!facilityId || !facilityName || !district || isNaN(ambulancesDeployed)) {
          throw new Error(`Missing required fields in row ${index + 1}`);
        }

        return {
          facilityId,
          facilityName,
          district,
          ambulancesDeployed,
          operationalStatus,
          populationServed,
          roadCondition,
          priorityTier
        };
      });

      // Calculate analytics
      const facilityAnalytics = calculateAnalytics(facilities);
      setAnalytics(facilityAnalytics);
      
      setSuccess(`Successfully loaded and analyzed ${facilities.length} facilities from Excel file`);
      onFacilitiesLoaded(facilities, ambulanceCount);
      setFile(null);
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse Excel data");
    }
  };

  const handleJsonSubmit = () => {
    if (!jsonData.trim()) {
      setError("Please enter JSON data");
      return;
    }
    processJsonData(jsonData);
  };

  const handleFileSubmit = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      await processExcelData(file);
    } else if (fileExtension === 'json' || fileExtension === 'txt') {
      const text = await file.text();
      processJsonData(text);
    } else {
      setError("Unsupported file format. Please upload .json, .txt, .xlsx, or .xls files");
    }
  };

  const handleDemoData = () => {
    const demoData = {
      facilities: [
        {
          facilityId: "EC001",
          facilityName: "Alice Hospital",
          district: "Amathole",
          ambulancesDeployed: 1,
          operationalStatus: "Grounded",
          populationServed: 50000,
          roadCondition: "Poor",
          priorityTier: "Critical"
        },
        {
          facilityId: "EC002",
          facilityName: "OR Tambo MOU",
          district: "OR Tambo",
          ambulancesDeployed: 7,
          operationalStatus: "Operational",
          populationServed: 200000,
          roadCondition: "Moderate",
          priorityTier: "High"
        }
      ],
      availableAmbulances: 3
    };
    processJsonData(JSON.stringify(demoData));
  };

  const exportToCSV = () => {
    const headers = ["Facility ID,Facility Name,District,Ambulances Deployed,Operational Status,Population Served,Road Condition,Priority Tier"];
    const rows = facilities.map(facility => 
      `${facility.facilityId},${facility.facilityName},${facility.district},${facility.ambulancesDeployed},${facility.operationalStatus},${facility.populationServed},${facility.roadCondition},${facility.priorityTier}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `facilities_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(facilities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facilities");
    XLSX.writeFile(workbook, `facilities_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getTemplateExcel = () => {
    const template = [
      {
        "Facility ID": "EC001",
        "Facility Name": "Alice Hospital",
        "District": "Amathole",
        "Ambulances Deployed": 1,
        "Operational Status": "Grounded",
        "Population Served": 50000,
        "Road Condition": "Poor",
        "Priority Tier": "Critical"
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "facility_template.xlsx");
  };

  return (
    <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-2 rounded-md">
              <Upload className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-white">Data Management</CardTitle>
              <CardDescription className="text-slate-300">
                Import, export, and analyze facility data for ambulance allocation
              </CardDescription>
            </div>
          </div>
          {facilities.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToExcel}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {analytics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-medium">Data Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Total Facilities</p>
                  <p className="text-white text-lg font-bold">{analytics.totalFacilities}</p>
                </div>
                
                <div>
                  <p className="text-slate-400 mb-1">Priority Distribution</p>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-white">Critical: {analytics.priorityDistribution.Critical}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-white">High: {analytics.priorityDistribution.High}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-white">Medium: {analytics.priorityDistribution.Medium}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-white">Low: {analytics.priorityDistribution.Low}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-slate-400 mb-1">Operational Status</p>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-gray-500 rounded-full"></span>
                    <span className="text-white">Grounded: {analytics.operationalStatusDistribution.Grounded}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                    <span className="text-white">Operational: {analytics.operationalStatusDistribution.Operational}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span className="text-white">Partially Operational: {analytics.operationalStatusDistribution["Partially Operational"]}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-slate-400 text-sm">
                  Population-to-ambulance ratio: {(analytics.totalFacilities / ambulanceCount).toFixed(1)} facilities per ambulance
                </p>
              </div>
            </motion.div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="ambulances" className="text-sm text-slate-300">
                Available Ambulances
              </label>
              <span className="text-lg font-bold text-white">{ambulanceCount}</span>
            </div>
            <Input 
              id="ambulances"
              type="range" 
              min={1} 
              max={10} 
              value={ambulanceCount} 
              onChange={(e) => setAmbulanceCount(parseInt(e.target.value))}
              className="cursor-pointer"
            />
          </div>
          
          <Tabs 
            defaultValue="json" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 mb-4 bg-slate-800/80">
              <TabsTrigger value="json">JSON Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="space-y-4">
              <Textarea
                placeholder="Paste your JSON data here..."
                className="min-h-[200px] bg-slate-800/50 border-slate-700/50 resize-none"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
              />
              <Button 
                onClick={handleJsonSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-500"
              >
                Process JSON Data
              </Button>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                  <p className="text-sm text-slate-300">
                    Upload Excel (.xlsx, .xls), JSON, or text files
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.txt,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="bg-slate-800/50 border-slate-700/50"
                />
                {file && (
                  <p className="text-sm text-slate-300">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleFileSubmit}
                disabled={!file}
                className="w-full bg-emerald-600 hover:bg-emerald-500"
              >
                Upload and Process
              </Button>
              
              <div className="pt-2 border-t border-slate-700/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getTemplateExcel}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel Template
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700/50 pt-4 flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleDemoData}
          className="w-full border-slate-600 hover:bg-slate-700"
        >
          Load Demo Data
        </Button>
      </CardFooter>
    </Card>
  );
}