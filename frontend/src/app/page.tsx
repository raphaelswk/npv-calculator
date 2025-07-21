/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NpvRequest, NpvRequestSchema } from '@/app/lib/validators';

import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Toaster } from '@/app/components/ui/sonner';
import { toast } from 'sonner';
import { NpvChart } from '@/app/components/NpvChart';

type NpvResult = {
  discountRate: number;
  netPresentValue: number;
};

export default function Home() {
  const [results, setResults] = useState<NpvResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NpvRequest>({
    // resolver: zodResolver(NpvRequestSchema),
    defaultValues: {
      cashFlows: '-100000, 25000, 30000, 35000, 40000',
      lowerBoundDiscountRate: 0.01,
      upperBoundDiscountRate: 0.15,
      discountRateIncrement: 0.01,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: NpvRequest) => {
    setIsLoading(true);
    setResults([]);

    try {
        const parsedCashFlows = data.cashFlows.split(',').map(cf => parseFloat(cf.trim()));
        if (parsedCashFlows.some(isNaN)) {
            toast.error("Invalid cash flow values. Please provide comma-separated numbers.");
            setIsLoading(false);
            return;
        }

        const response = await fetch('https://localhost:7251/api/Npv/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, cashFlows: parsedCashFlows })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to read response stream.");
        
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (value) {
                buffer += decoder.decode(value, { stream: true });
            }
            // Inner loop to process all complete objects currently in the buffer
            while (true) {
                const objectStartIndex = buffer.indexOf('{');
                if (objectStartIndex === -1) {
                    // No more objects in the buffer, wait for more data
                    break;
                }

                let braceCount = 0;
                let objectEndIndex = -1;
                for (let i = objectStartIndex; i < buffer.length; i++) {
                    if (buffer[i] === '{') {
                        braceCount++;
                    } else if (buffer[i] === '}') {
                        braceCount--;
                    }
                    if (braceCount === 0) {
                        objectEndIndex = i;
                        break;
                    }
                }

                if (objectEndIndex === -1) {
                    // We have an incomplete object, wait for the next chunk of data
                    break;
                }

                // We found a complete JSON object
                const jsonObjStr = buffer.substring(objectStartIndex, objectEndIndex + 1);
                
                try {
                    const result = JSON.parse(jsonObjStr);
                    setResults(prev => [...prev, result]);
                } catch (e) {
                    console.warn("Failed to parse JSON chunk:", jsonObjStr, e);
                }

                // Remove the processed object from the buffer and check for more
                buffer = buffer.substring(objectEndIndex + 1);
            }

            if (done) {
                break; // Exit the main while loop when the stream is finished
            }
        }

    } catch (error: any) {
        console.error("Calculation failed:", error);
        toast.error(error.message || "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">NPV Calculator</h1>
          <p className="text-muted-foreground">
            Real-time Net Present Value Calculation and Visualization
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calculation Parameters</CardTitle>
              <CardDescription>
                Enter your cash flows and discount rate range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="cashFlows">
                    Cash Flows (comma-separated)
                  </Label>
                  <Input id="cashFlows" {...register('cashFlows')} />
                  {errors.cashFlows && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cashFlows.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lowerBoundDiscountRate">Lower Rate</Label>
                    <Input
                      id="lowerBoundDiscountRate"
                      type="number"
                      step="0.01"
                      {...register('lowerBoundDiscountRate')}
                    />
                    {errors.lowerBoundDiscountRate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lowerBoundDiscountRate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="upperBoundDiscountRate">Upper Rate</Label>
                    <Input
                      id="upperBoundDiscountRate"
                      type="number"
                      step="0.01"
                      {...register('upperBoundDiscountRate')}
                    />
                    {errors.upperBoundDiscountRate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.upperBoundDiscountRate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="discountRateIncrement">Rate Increment</Label>
                  <Input
                    id="discountRateIncrement"
                    type="number"
                    step="0.0025"
                    {...register('discountRateIncrement')}
                  />
                  {errors.discountRateIncrement && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discountRateIncrement.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Calculating...' : 'Calculate NPV'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Results will appear here progressively.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NpvChart data={results} />
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Discount Rate</TableHead>
                      <TableHead className="text-right">
                        Net Present Value (NPV)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length > 0 ? (
                      results.map((res, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {(res.discountRate * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {res.netPresentValue?.toLocaleString('en-US', { 
                              style: 'currency', 
                              currency: 'EUR' }) ?? 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground h-24"
                        >
                          {isLoading
                            ? 'Receiving data...'
                            : 'No results to display.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
