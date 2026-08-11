"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { Search, Filter, Eye, UploadCloud, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type ManagedField<T> = { value: T; isOverridden: boolean };

interface EnquiryUI {
  id: string;
  rawText: string;
  createdAt: string;
  priority: string;
  status: string;
  extractionVersion: number;
  company?: ManagedField<string>;
  contactName?: ManagedField<string>;
  contactEmail?: ManagedField<string>;
  serviceLine?: ManagedField<string>;
  budgetNormalizedUSD?: ManagedField<number>;
  summary?: ManagedField<string>;
  [key: string]: unknown;
}

export default function TriageDashboard() {
  const [enquiries, setEnquiries] = useState<EnquiryUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryUI | null>(null);

  // Ingestion State
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [ingestText, setIngestText] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestLogs, setIngestLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initialFetch = async () => {
      try {
        const res = await fetch("/api/enquiries");
        const json = await res.json();
        if (json.success && isMounted) {
          setEnquiries(json.data);
        }
      } catch {
        if (isMounted) toast.error("Failed to fetch initial enquiries");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void initialFetch();
    return () => { isMounted = false; };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch {
      toast.error("Failed to refresh enquiries");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setIngestText(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleIngestSubmit = async () => {
    if (!ingestText.trim()) {
      toast.error("Please paste or upload enquiries first.");
      return;
    }

    setIsIngesting(true);
    setIngestLogs(["Starting ingestion engine..."]);

    // Parse the file based on dashed lines (as per the sample-enquiries.txt format)
    const rawEnquiries = ingestText.split(/-{10,}/).map(s => s.trim()).filter(Boolean);
    
    setIngestLogs(prev => [...prev, `Found ${rawEnquiries.length} individual enquiries to process.`]);

    try {
      const res = await fetch('/api/batch-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiries: rawEnquiries })
      });

      if (!res.body) throw new Error("No stream found");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const readChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          toast.success("Batch ingestion complete!");
          setIsIngesting(false);
          setIngestText("");
          setIngestLogs([]);
          setIsIngestOpen(false);
          void handleRefresh();
          return;
        }
        
        const chunk = decoder.decode(value);
        setIngestLogs(prev => [...prev, chunk]);
        // Auto-scroll logic for terminal could go here
        
        await readChunk();
      };
      
      await readChunk();
    } catch (error) {
      toast.error("Ingestion stream failed.");
      setIsIngesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Lead Triage</h1>
            <p className="text-zinc-500">Manage and score incoming project enquiries.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={loading} className="flex-1 sm:flex-none">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={() => setIsIngestOpen(true)}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Ingest Batch
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-zinc-200">
          <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input placeholder="Search companies or contacts..." className="pl-9 bg-white w-full" />
            </div>
            <Button variant="outline" className="text-zinc-600 w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-zinc-50/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Budget (Est)</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-zinc-500">Loading...</TableCell></TableRow>
                ) : enquiries.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-zinc-500">No enquiries found. Ingest some leads to begin.</TableCell></TableRow>
                ) : (
                  enquiries.map((enq) => (
                    <TableRow key={enq.id}>
                      <TableCell className="text-zinc-600 whitespace-nowrap">
                        {format(new Date(enq.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-zinc-900 truncate max-w-[200px]">{enq.company?.value || "Unknown Company"}</div>
                        <div className="text-sm text-zinc-500 truncate max-w-[200px]">{enq.contactEmail?.value || enq.contactName?.value || "No contact"}</div>
                      </TableCell>
                      <TableCell className="capitalize">{enq.serviceLine?.value}</TableCell>
                      <TableCell className="text-zinc-600">
                        {enq.budgetNormalizedUSD?.value ? `$${enq.budgetNormalizedUSD.value.toLocaleString()}` : "TBD"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize whitespace-nowrap ${getPriorityColor(enq.priority)}`}>
                          {enq.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{enq.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enq)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={isIngestOpen} onOpenChange={(open) => !isIngesting && setIsIngestOpen(open)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Ingest Enquiries</DialogTitle>
              <DialogDescription>
                Paste a single enquiry, or upload a .txt file containing multiple enquiries separated by dashes.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isIngesting}>
                  <FileText className="w-4 h-4 mr-2" /> Upload .txt File
                </Button>
                <input 
                  type="file" 
                  accept=".txt" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <span className="text-sm text-zinc-500">or paste text below:</span>
              </div>
              
              <Textarea 
                className="flex-1 h-[40vh] resize-none overflow-y-auto bg-zinc-50 font-mono text-xs"
                placeholder="From: ...\nEmail: ...\nMessage: ..."
                value={ingestText}
                onChange={(e) => setIngestText(e.target.value)}
                disabled={isIngesting}
              />

              {isIngesting && (
                <div className="bg-zinc-950 rounded-md p-4 mt-4 h-40 overflow-y-auto font-mono text-xs text-green-400 border border-zinc-800 shadow-inner">
                  {ingestLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsIngestOpen(false)} disabled={isIngesting}>Cancel</Button>
              <Button onClick={handleIngestSubmit} disabled={isIngesting || !ingestText.trim()}>
                {isIngesting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {isIngesting ? "Processing Stream..." : "Process Leads"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={!!selectedEnquiry} onOpenChange={(open) => {
          if (!open) {
            setSelectedEnquiry(null);
            void handleRefresh();
          }
        }}>
          <SheetContent className="w-full sm:max-w-4xl lg:max-w-5xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pr-8">
                <div>
                  <SheetTitle className="text-xl">Enquiry Details</SheetTitle>
                  <SheetDescription>v{selectedEnquiry?.extractionVersion} • Priority: {selectedEnquiry?.priority}</SheetDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    if (!selectedEnquiry) return;
                    const toastId = toast.loading("Re-extracting AI data...");
                    try {
                      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, { method: 'POST' });
                      const json = await res.json();
                      if (json.success) {
                        setSelectedEnquiry(json.data);
                        toast.success("Extraction complete. Human edits preserved.", { id: toastId });
                      } else {
                        toast.error("Re-extraction failed.", { id: toastId });
                      }
                    } catch {
                      toast.error("Re-extraction failed due to network error.", { id: toastId });
                    }
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Re-Extract Data
                </Button>
              </div>
            </SheetHeader>
            
            {selectedEnquiry && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Original Submission</h3>
                  <div className="bg-zinc-100 p-4 rounded-md text-sm text-zinc-800 whitespace-pre-wrap border border-zinc-200 shadow-inner">
                    {selectedEnquiry.rawText}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-2">Extracted Data</h3>
                  
                  {['company', 'contactName', 'serviceLine', 'summary'].map((key) => {
                    const fieldData = selectedEnquiry[key] as ManagedField<string> | undefined;
                    return (
                      <div key={key} className="grid gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</label>
                          {fieldData?.isOverridden && (
                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 shadow-sm">Human Override</Badge>
                          )}
                        </div>
                        
                        {key === 'summary' ? (
                          <textarea 
                            className="flex min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1"
                            defaultValue={fieldData?.value || ""}
                            onBlur={async (e) => {
                              if (e.target.value !== fieldData?.value) {
                                const toastId = toast.loading("Saving update...");
                                try {
                                  const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ field: key, value: e.target.value })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setSelectedEnquiry(updated.data);
                                    toast.success("Update saved", { id: toastId });
                                  } else {
                                    toast.error("Failed to save", { id: toastId });
                                  }
                                } catch {
                                  toast.error("Network error saving update", { id: toastId });
                                }
                              }
                            }}
                          />
                        ) : (
                          <Input 
                            className="bg-white border-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 shadow-sm"
                            defaultValue={fieldData?.value || ""} 
                            onBlur={async (e) => {
                              if (e.target.value !== fieldData?.value) {
                                const toastId = toast.loading(`Saving ${key}...`);
                                try {
                                  const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ field: key, value: e.target.value })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setSelectedEnquiry(updated.data);
                                    toast.success(`${key} saved`, { id: toastId });
                                  } else {
                                    toast.error("Failed to save", { id: toastId });
                                  }
                                } catch {
                                  toast.error("Network error saving update", { id: toastId });
                                }
                              }
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}