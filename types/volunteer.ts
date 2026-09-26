export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  photoUrl: string | null;
  role: string;
  status: "Active" | "Inactive";
  validFrom: string;
};