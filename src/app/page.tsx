"use client";

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
    const [searchResults, setSearchResults] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchCars();
    }, []);

    // NEW: trigger search when input values change
    useEffect(() => {
        handleSearch();
    }, [plate, model]);

    const fetchCars = async () => {
        const { data, error } = await supabase
            .from('cars')
            .select('*');

        if (error) {
            console.error("Error fetching cars:", error);
            toast({
                title: "Error",
                description: "Failed to load car data.",
                variant: "destructive",
            });
        } else {
            setCars(data);
            setSearchResults(data);
        }
    };


    const handleSearch = () => {
        const results = cars.filter((car) =>
            car.plate.includes(plate) &&
            car.model.includes(model)
        );
        setSearchResults(results);
    };

    const handleCallOwner = (phone: string) => {
        toast({
            title: "Calling Owner",
            description: `Initiating call to ${phone}...`,
        });

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

        const { data, error } = await supabase
            .from('cars')
            .insert([newCar])
            .select();

        if (error) {
            console.error("Error submitting car:", error);
            toast({
                title: "Error",
                description: "Failed to submit car data.",
                variant: "destructive",
            });
        } else {
            setCars([...cars, newCar as any]);
            toast({
                title: "Car Submitted",
                description: `Car with plate ${newCar.plate} submitted successfully!`,
            });
            fetchCars(); // Refresh car list
        }
    };

    return (
        <div className="relative container mx-auto p-4">
            {/* Dialog Trigger Button on top left */}
            <Dialog>
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
                                    <Input type="text" id="plate" name="plate" required />
                                </div>
                                <div>
                                    <Label htmlFor="model">مدل:</Label>
                                    <Input type="text" id="model" name="model" />
                                </div>
                                <div>
                                    <Label htmlFor="ownerUnit">واحد:</Label>
                                    <Input type="text" id="ownerUnit" name="ownerUnit" />
                                </div>
                                <div>
                                    <Label htmlFor="phone">شماره موبایل:</Label>
                                    <Input type="tel" id="phone" name="phone" required />
                                </div>
                                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/80">
                                    ثبت
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Page Header */}
            <h1 className="text-2xl font-bold mb-4">اطلاعات خودروها</h1>

            {/* Search Filters */}
            <div className="flex items-center gap-4 mb-4">
                <Input type="text" placeholder="شماره پلاک" value={plate} onChange={(e) => setPlate(e.target.value)} />
                <Input type="text" placeholder="مدل و رنگ" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            {/* Removed the search button as search is now triggered on input change */}

            {/* Search Results */}
            <h2 className="text-xl font-bold mt-6 mb-2">نتایج جستجو</h2>
            {searchResults.length === 0 ? (
                <p>هیچ نتیجه ای یافت نشد.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">پلاک</TableHead>
                                <TableHead>مدل و رنگ</TableHead>
                                <TableHead className="text-right">واحد</TableHead>
                                <TableHead className="text-right">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchResults.map((car: any) => (
                                <TableRow key={car.plate}>
                                    <TableCell className="font-medium">{car.plate}</TableCell>
                                    <TableCell>{car.model}</TableCell>
                                    <TableCell className="text-right">{car.ownerUnit}</TableCell>
                                    <TableCell className="text-right flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleCallOwner(car.phone)}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            تماس با مالک
                                        </Button>
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
