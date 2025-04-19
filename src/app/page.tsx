"use client";

// NEW: Add helper function for converting Arabic/Persian numbers to English numbers
function convertToEnglishNumbers(input: string): string {
    return input.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (d) =>
        String.fromCharCode(
            d.charCodeAt(0) < 0x06f0 
                ? d.charCodeAt(0) - 0x0660 + 48 
                : d.charCodeAt(0) - 0x06f0 + 48
        )
    );
}

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Phone } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export default function Home() {
    const [cars, setCars] = useState([]);
    const [plate, setPlate] = useState("");
    const [model, setModel] = useState("");
    const [searchResults, setSearchResults] = useState([{}]);
    const [loading, setLoading] = useState(false); // new loading state
    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchCars();
    }, []);

    // NEW: trigger search when input values change
    useEffect(() => {
        handleSearch();
    }, [plate, model]);

    const fetchCars = async () => {
        setLoading(true); // start loading
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('id', { ascending: false }) // sort by id descending
            .limit(10000);

        setLoading(false); // end loading

        if (error) {
            console.error("Error fetching cars:", error);
            alert("خطا در دریافت اطلعات خودرو ها"); // replaced toast with alert
        } else {
            setCars(data);
            setSearchResults(data);
        }
    };


    const handleSearch = () => {
        let results = cars;
        if (plate.length && model.length) {
            results = cars.filter((car: any) => 
                car.plate.includes(plate) && car.model.includes(model)
            );
        } else if (plate.length) {;
            results = cars.filter((car: any) => 
                car.plate.includes(plate)
            );
        } else if (model.length) {
            results = cars.filter((car: any) => 
                car.model.includes(model)
            );
        }
        setSearchResults(results);
    };

    const handleCallOwner = (phone: string) => {
        // alert(`Calling Owner: Initiating call to ${phone}...`); // replaced toast with alert
        window.location.href = `tel:${phone}`;
    };

    const handleSubmitCar = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newCar = {
            plate: formData.get("plate") as string,
            model: formData.get("model") as string,
            ownerUnit: formData.get("ownerUnit") as string,
            phone: formData.get("phone") as string,
        };

        // Prevent duplicate insert based on plate
        if(cars.some((car: any) => car.plate === newCar.plate)) {
            alert("این پلاک موجود است. امکان ثبت پلاک تکراری وجود ندارد"); // replaced toast with alert
            return;
        }

        const { data, error } = await supabase
            .from('cars')
            .insert([newCar])
            .select();

        if (error) {
            console.error("خطا در ثبت خودرو جدید", error);
            alert("خطا در ثبت خودرو جدید"); // replaced toast with alert
        } else {
            setCars([newCar as any, ...cars]);
            alert(`خودرو با پلاک ${newCar.plate} ثبت شد!`); // replaced toast with alert
            setOpen(false); // close dialog after submission
            fetchCars(); // Refresh car list
        }
    };

    // Add helper function to compute elapsed time
    const getTimeElapsed = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds} ثانیه پیش`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ساعت پیش`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 365) return `${diffInDays} روز پیش`;
        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} سال پیش`;
    };

    return (
        <div className="relative container mx-auto p-4">
            {/* Dialog Trigger Button on top left */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="absolute top-4 left-4 bg-accent text-accent-foreground hover:bg-accent/80">
                        ثبت خودرو
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>ثبت اطلاعات خودرو</DialogTitle>
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmitCar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="plate">شماره پلاک:</Label>
                                    <Input
                                        type="text"
                                        id="plate"
                                        name="plate"
                                        minLength={8}
                                        required
                                        pattern="^[0-9]{2}\|[0-9]{3}.*"
                                        placeholder="مثال: 55|973ل61"
                                        // NEW: Convert input to English digits
                                        onChange={(e) => { e.target.value = convertToEnglishNumbers(e.target.value); }}
                                    />
                                    پلاک را به صورت 55|973ل61 و بدون فاصله کنید
                                </div>
                                <div>
                                    <Label htmlFor="model">مدل و رنگ خودرو:</Label>
                                    <Input
                                        type="text"
                                        id="model"
                                        name="model"
                                        // NEW: Convert input to English digits
                                        onChange={(e) => { e.target.value = convertToEnglishNumbers(e.target.value); }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ownerUnit">نام مالک:</Label>
                                    <Input
                                        type="text"
                                        id="ownerUnit"
                                        name="ownerUnit"
                                        // NEW: Convert input to English digits
                                        onChange={(e) => { e.target.value = convertToEnglishNumbers(e.target.value); }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">شماره موبایل:</Label>
                                    <Input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        required 
                                        pattern="^09[0-9]{9}$"
                                        inputMode="numeric"
                                        // UPDATED: Convert to English digits then filter non-digits
                                        onChange={(e) => { 
                                            let newValue = convertToEnglishNumbers(e.target.value);
                                            newValue = newValue.replace(/\D/g, "");
                                            if (newValue.length > 11) newValue = newValue.slice(0, 11);
                                            e.target.value = newValue;
                                        }}
                                    />
                                </div>
                                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/80">
                                    ثبت خودرو
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Page Header */}
            <h1 className="text-2xl font-bold mb-4">جستجو در اطلاعات خودروها</h1>

            {/* Search Filters */}
            <div className="flex items-center gap-4 mb-4">
                <Input 
                    type="text" 
                    placeholder="شماره پلاک" 
                    value={plate} 
                    // NEW: Convert user input to English digits
                    onChange={(e) => setPlate(convertToEnglishNumbers(e.target.value))} 
                />
                <Input 
                    type="text" 
                    placeholder="مدل و رنگ" 
                    value={model} 
                    // NEW: Convert user input to English digits
                    onChange={(e) => setModel(convertToEnglishNumbers(e.target.value))} 
                />
            </div>
            {/* Removed the search button as search is now triggered on input change */}

            {/* Search Results */}
            {loading ? (
                <p>درحال فراخوانی اطلاعات...</p>
            ) : searchResults.length === 0 ? (
                <p>هیچ نتیجه ای یافت نشد.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">پلاک</TableHead>
                                <TableHead>مدل، رنگ، مالک</TableHead>
                                <TableHead className="text-right">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchResults.map((car: any, index: number) => (
                                <TableRow key={car.id || `${car.plate}_${index}`}>
                                    <TableCell className="font-medium">{car.plate}</TableCell>
                                    <TableCell>
                                        {car.model}
                                        <div>
                                        <small className="text-xs text-center text-muted-foreground">
                                        {car.ownerUnit}
                                        </small>
                                        </div>
                                        </TableCell>
                                    <TableCell className="text-right flex flex-col gap-0.5">
                                        <Button variant="outline" size="sm" onClick={() => handleCallOwner(car.phone)}>
                                            <Phone className="mr-2 h-2 w-2" />
                                            تماس
                                        </Button>
                                        <small className="text-xs text-center text-muted-foreground">
                                            {getTimeElapsed(car.created_at)}
                                        </small>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
