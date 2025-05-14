
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecksIcon, PlusCircle } from "lucide-react";

export default function AgencyListingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListChecksIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Car Listings</h1>
        </div>
        <CardDescription>View, edit, and manage your car listings. Add new cars to expand your fleet.</CardDescription>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Fleet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            This section is under construction. Here you will be able to see all your listed cars, edit their details,
            and manage their status.
          </p>
          <Button asChild>
            <Link href="/account/listings/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Car Listing
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
