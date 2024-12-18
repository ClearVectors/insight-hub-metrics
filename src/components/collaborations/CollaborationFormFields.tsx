import { BasicInfoFields } from "./form/BasicInfoFields";
import { AgreementFields } from "./form/AgreementFields";
import { ContactFields } from "./form/ContactFields";
import { WorkstreamFields } from "./form/WorkstreamFields";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { useCollaborationForm } from "./form/useCollaborationForm";
import { CollaborationFormSchema } from "./form/types";

interface CollaborationFormFieldsProps {
  onSubmit: () => void;
  initialData: Collaborator | null;
  collaborationType?: "fortune30" | "sme";
  departmentId?: string;
}

export function CollaborationFormFields({
  onSubmit,
  initialData,
  collaborationType = "fortune30",
  departmentId,
}: CollaborationFormFieldsProps) {
  const form = useCollaborationForm(initialData);

  const handleSubmit = async (data: CollaborationFormSchema) => {
    try {
      const agreements = {
        ...(data.agreementType === "NDA" || data.agreementType === "Both"
          ? {
              nda: {
                signedDate: data.signedDate || new Date().toISOString(),
                expiryDate: data.expiryDate || new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "signed" as const,
              },
            }
          : {}),
        ...(data.agreementType === "JTDA" || data.agreementType === "Both"
          ? {
              jtda: {
                signedDate: data.signedDate || new Date().toISOString(),
                expiryDate: data.expiryDate || new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "signed" as const,
              },
            }
          : {}),
      };

      const collaborator: Collaborator = {
        id: initialData?.id || `collaborator-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        type: data.type,
        color: data.color,
        ratMember: data.ratMember,
        agreements,
        primaryContact: {
          name: data.primaryContact.name,
          role: data.primaryContact.role,
          email: data.primaryContact.email,
          phone: data.primaryContact.phone,
        },
        workstreams: data.workstreams?.map(ws => ({
          id: ws.id || `workstream-${Date.now()}`,
          title: ws.title,
          objectives: ws.objectives,
          nextSteps: ws.nextSteps,
          keyContacts: ws.keyContacts.map(contact => ({
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
          })),
          status: ws.status,
          startDate: ws.startDate,
          lastUpdated: ws.lastUpdated,
          ratMember: ws.ratMember,
          agreements: ws.agreements && {
            nda: ws.agreements.nda ? {
              signedDate: ws.agreements.nda.signedDate,
              expiryDate: ws.agreements.nda.expiryDate,
              status: ws.agreements.nda.status
            } : undefined,
            jtda: ws.agreements.jtda ? {
              signedDate: ws.agreements.jtda.signedDate,
              expiryDate: ws.agreements.jtda.expiryDate,
              status: ws.agreements.jtda.status
            } : undefined
          }
        })) || [],
        projects: initialData?.projects || [],
        lastActive: new Date().toISOString(),
      };

      if (initialData?.id) {
        await db.updateCollaborator(initialData.id, collaborator);
      } else {
        await db.addCollaborator(collaborator);
      }

      toast({
        title: "Success",
        description: `Collaboration ${initialData ? "updated" : "created"} successfully`,
      });

      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} collaboration`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <BasicInfoFields form={form} departmentId={departmentId} />
      <AgreementFields form={form} />
      <ContactFields form={form} />
      <WorkstreamFields form={form} />

      <div className="flex justify-end">
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {initialData ? "Update" : "Create"} Collaboration
        </Button>
      </div>
    </div>
  );
}