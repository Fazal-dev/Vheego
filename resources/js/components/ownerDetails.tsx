import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import { Mail, Phone, User } from 'lucide-react';

export default function OwnerDetails({ owner }: { owner: any }) {
    return (
        <Card className="col-span-4 rounded-xl border-1 border-green-300 bg-white shadow-sm md:col-span-1">
            <CardHeader className="flex flex-row items-center gap-3 pb-1">
                <Avatar className="h-10 w-10">
                    {/* If you have an owner avatar URL */}
                    <AvatarImage alt={owner.name} />
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                        {owner.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <CardTitle className="text-md font-semibold">
                    Owner Contact Details
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-4 pt-2">
                <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                        <User className="mt-1 h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Owner Name</p>
                            <p className="font-medium">
                                {capitalizeWords(owner.name)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                        <Mail className="mt-1 h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{owner.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                        <Phone className="mt-1 h-5 w-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{owner.phone_no}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
