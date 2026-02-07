"use client";

import { useState } from "react";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEAD_STATUSES, WHITELIST_STATUSES } from "@/lib/constants";
import type { Lead, LeadStatus, WhitelistStatus } from "@/lib/types";
import { Plus, Pencil, Trash2, Loader2, Search, Building2, Mail, Phone } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

export default function LeadsPage() {
  const { data, loading, refetch } = useApi<{ leads: Lead[] }>("/api/leads");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWhitelist, setFilterWhitelist] = useState("all");
  const [search, setSearch] = useState("");

  // Form state
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<LeadStatus>("prospect");
  const [saasProduct, setSaasProduct] = useState("");
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus>("pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const leads = data?.leads || [];

  const filtered = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterWhitelist !== "all" && l.whitelist_status !== filterWhitelist) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !l.company?.toLowerCase().includes(q) &&
        !l.contact_name?.toLowerCase().includes(q) &&
        !l.contact_email?.toLowerCase().includes(q) &&
        !l.saas_product?.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const openCreate = () => {
    setEditing(null);
    setCompany("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setProjectDescription("");
    setBudget("");
    setStatus("prospect");
    setSaasProduct("");
    setWhitelistStatus("pending");
    setNotes("");
    setIsFormOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setCompany(lead.company || "");
    setContactName(lead.contact_name || "");
    setContactEmail(lead.contact_email || "");
    setContactPhone(lead.contact_phone || "");
    setProjectDescription(lead.project_description || "");
    setBudget(lead.budget?.toString() || "");
    setStatus(lead.status as LeadStatus);
    setSaasProduct(lead.saas_product || "");
    setWhitelistStatus((lead.whitelist_status as WhitelistStatus) || "pending");
    setNotes(lead.notes || "");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;
    setSaving(true);
    try {
      const body = {
        company: company.trim() || "",
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        project_description: projectDescription.trim() || null,
        budget: budget ? parseFloat(budget) : null,
        status,
        saas_product: saasProduct.trim() || null,
        whitelist_status: whitelistStatus,
        notes: notes.trim() || null,
      };
      if (editing) {
        await apiMutate(`/api/leads/${editing.id}`, "PATCH", body);
      } else {
        await apiMutate("/api/leads", "POST", body);
      }
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      console.error("Erreur sauvegarde lead:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiMutate(`/api/leads/${id}`, "DELETE");
      refetch();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const getStatusConfig = (s: string) => LEAD_STATUSES.find((ls) => ls.value === s);
  const getWhitelistConfig = (s: string) => WHITELIST_STATUSES.find((ws) => ws.value === s);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
          >
            <option value="all">Tous les statuts</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filterWhitelist}
            onChange={(e) => setFilterWhitelist(e.target.value)}
            className="h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
          >
            <option value="all">Toutes whitelist</option>
            {WHITELIST_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau lead
        </Button>
      </div>

      {/* Leads Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <Building2 className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted">Aucun lead pour le moment</p>
          <Button onClick={openCreate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un prospect
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lead) => {
            const statusConf = getStatusConfig(lead.status);
            const wlConf = getWhitelistConfig(lead.whitelist_status || "");
            return (
              <Card key={lead.id} className="bg-surface border-border group hover:border-border-hover transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-bold text-sm truncate">{lead.contact_name}</h3>
                      {lead.company && (
                        <p className="text-text-muted text-xs">{lead.company}</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button onClick={() => openEdit(lead)} className="p-1.5 hover:bg-surface-hover rounded-lg">
                        <Pencil className="h-3.5 w-3.5 text-text-muted" />
                      </button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 hover:bg-surface-hover rounded-lg">
                        <Trash2 className="h-3.5 w-3.5 text-danger" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {statusConf && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-text-primary" style={{ backgroundColor: statusConf.color }}>
                        {statusConf.label}
                      </span>
                    )}
                    {wlConf && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-text-primary" style={{ backgroundColor: wlConf.color }}>
                        WL: {wlConf.label}
                      </span>
                    )}
                  </div>

                  {lead.saas_product && (
                    <div className="bg-surface-hover rounded-lg px-3 py-2 mb-3">
                      <p className="text-[10px] text-text-muted uppercase font-medium">Produit SaaS</p>
                      <p className="text-xs text-primary font-medium">{lead.saas_product}</p>
                    </div>
                  )}

                  {lead.project_description && (
                    <p className="text-xs text-text-muted line-clamp-2 mb-3">{lead.project_description}</p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <div className="flex items-center gap-3">
                      {lead.contact_email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.contact_email}
                        </span>
                      )}
                    </div>
                    {lead.budget && (
                      <span className="text-success font-medium">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(lead.budget)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lead Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(v) => !v && setIsFormOpen(false)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le lead" : "Nouveau lead"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Contact *</label>
                <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nom du contact" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Entreprise</label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nom de l'entreprise" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Email</label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Téléphone</label>
                <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+33..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Produit SaaS</label>
              <Input value={saasProduct} onChange={(e) => setSaasProduct(e.target.value)} placeholder="Nom du SaaS" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Description du projet</label>
              <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Décris le projet du prospect..." rows={3} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Budget</label>
                <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Whitelist</label>
                <select
                  value={whitelistStatus}
                  onChange={(e) => setWhitelistStatus(e.target.value as WhitelistStatus)}
                  className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
                >
                  {WHITELIST_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes internes..." rows={2} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !contactName.trim()}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editing ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
