"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Token name must be at least 2 characters." })
    .max(50, { message: "Token name must not exceed 50 characters." }),
  symbol: z
    .string()
    .min(2, { message: "Token symbol must be at least 2 characters." })
    .max(10, { message: "Token symbol must not exceed 10 characters." })
    .toUpperCase(),
  description: z
    .string()
    .max(200, { message: "Description must not exceed 200 characters." })
    .optional(),
  decimals: z.number().min(0).max(9),
  initialSupply: z.number().min(0),
  logo: z.string().optional(),
  isMintable: z.boolean().default(true),
  isBurnable: z.boolean().default(true),
  isPausable: z.boolean().default(true),
})

export type TokenFormValues = z.infer<typeof formSchema>

interface TokenCreationFormProps {
  onSubmit: (values: TokenFormValues) => void
  onChange?: (values: TokenFormValues) => void
  initialValues?: TokenFormValues
  saved?: boolean
  setSaved?: (v: boolean) => void
}

export default function TokenCreationForm({
  onSubmit,
  onChange,
  initialValues,
  saved,
  setSaved,
}: TokenCreationFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      symbol: "",
      description: "",
      decimals: 9,
      initialSupply: 1000000,
      logo: undefined,
      isMintable: true,
      isBurnable: true,
      isPausable: true,
    },
  })

  // Watch for changes and reset saved state, call onChange if provided
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (setSaved) setSaved(false)
      if (onChange) onChange(values as TokenFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, setSaved, onChange])

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setLogoPreview(dataUrl)
        form.setValue("logo", dataUrl)
        if (onChange) onChange({ ...form.getValues(), logo: dataUrl })
        if (setSaved) setSaved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values)
          if (setSaved) setSaved(true)
        })}
        className="space-y-6"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={logoPreview || ""} alt="Token Logo" />
              <AvatarFallback className="text-2xl">
                {form.watch("symbol") ? form.watch("symbol").substring(0, 2) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("logo-upload")?.click()}
              className="text-sm"
            >
              Upload Logo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Logo will be stored on IPFS for decentralized access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name <span className="text-red-800 font-bold">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="My Token" {...field} />
                </FormControl>
                <FormDescription>The full name of your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol <span className="text-red-800 font-bold">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="MTK" {...field} />
                </FormControl>
                <FormDescription>The ticker symbol for your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-red-800 font-bold">*</span></FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of your token..." {...field} />
              </FormControl>
              <FormDescription>Describe the purpose of your token.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="decimals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decimals: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={9}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Number of decimal places (0-9). Standard is 9 for Solana tokens.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialSupply"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Supply</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The initial amount of tokens to mint. You can mint more later if enabled.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="font-medium">Token Features</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Each enabled feature adds 0.05 SOL to the deployment cost.
          </p>

          <FormField
            control={form.control}
            name="isMintable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Mintable</FormLabel>
                  <FormDescription>
                    Allow creating new tokens after deployment.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isBurnable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Burnable</FormLabel>
                  <FormDescription>
                    Allow burning tokens to reduce supply.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPausable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Pausable</FormLabel>
                  <FormDescription>
                    Allow pausing token transfers in emergencies.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}