
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarkedIcon } from "lucide-react";

export default function AgencyBookingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <BookMarkedIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Booking Requests</h1>
        </div>
        <CardDescription>Review and manage incoming booking requests for your vehicles.</CardDescription>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            This page will display all booking requests (pending, confirmed, completed, cancelled).
            Content and functionality coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
