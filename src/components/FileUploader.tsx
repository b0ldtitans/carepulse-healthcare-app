"use client";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { XCircle } from "lucide-react";

interface FileUploaderProps {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
}

export function FileUploader({ files, onChange }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div {...getRootProps()} className="file-upload relative">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <>
          <Image
            src={convertFileToUrl(files[0])}
            width={1000}
            height={1000}
            alt="uploaded image"
            className="max-h-[400px] overflow-hidden object-cover"
          />
          <button
            onClick={handleDelete}
            type="button"
            className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full hover:bg-red-500"
          >
            <XCircle size={20} />
          </button>
        </>
      ) : (
        <>
          <Image
            src={"/assets/icons/upload.svg"}
            height={40}
            width={40}
            alt="upload"
          />

          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag
              and drop
            </p>
            <p>SVG, PNG, JPG, or Gif (max 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
}
