"use client";

import { useEffect, useState } from "react";

import { unsplash } from "@/lib/unsplash";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DEFAULT_IMAGES } from "@/constants/images";
import Link from "next/link";
import FormErrors from "./FormErrors";

const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        throw new Error("lol");
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (result && result.response) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("Failed to get images from unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(DEFAULT_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              fill
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};

export default FormPicker;
