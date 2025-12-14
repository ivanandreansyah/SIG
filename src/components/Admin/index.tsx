"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

// Page Header
interface PageHeaderProps {
  title: string;
  description: string;
  backHref?: string;
  action?: ReactNode;
}

export const PageHeader = ({
  title,
  description,
  backHref,
  action,
}: PageHeaderProps) => (
  <div className="flex items-center gap-4 mb-8">
    {backHref && (
      <Link
        href={backHref}
        className="p-2.5 bg-slate-800/50 border border-white/10 rounded-xl hover:bg-slate-700/50 hover:border-purple-500/30 transition-all shadow-lg backdrop-blur-xl"
      >
        <ChevronLeft className="w-5 h-5 text-slate-300" />
      </Link>
    )}
    <div className="flex-1 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 mt-1">{description}</p>
      </div>
      {action}
    </div>
  </div>
);

// Card Container
interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

// Card Header
interface CardHeaderProps {
  title: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, action }: CardHeaderProps) => (
  <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {action}
  </div>
);

// Empty State
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <div className="p-12 text-center">
    <div className="w-14 h-14 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
      {icon}
    </div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

// Loading State
export const LoadingState = () => (
  <div className="p-12 text-center">
    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
    <p className="text-slate-400 text-sm">Memuat data...</p>
  </div>
);

// Primary Button
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export const Button = ({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30",
    secondary:
      "bg-slate-800/50 text-slate-300 border border-white/10 hover:bg-slate-700/50 hover:border-purple-500/30 backdrop-blur-xl",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Link Button
interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const LinkButton = ({
  href,
  children,
  variant = "primary",
  className = "",
}: LinkButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30",
    secondary:
      "bg-slate-800/50 text-slate-300 border border-white/10 hover:bg-slate-700/50 hover:border-purple-500/30 backdrop-blur-xl",
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
};

// Form Field
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export const FormField = ({
  label,
  required,
  children,
  hint,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-300">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = "", ...props }: InputProps) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 border border-white/10 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all backdrop-blur-xl ${className}`}
  />
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

export const Select = ({ children, className = "", ...props }: SelectProps) => (
  <select
    {...props}
    className={`w-full px-4 py-2.5 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all disabled:bg-slate-900/50 disabled:text-slate-600 backdrop-blur-xl ${className}`}
  >
    {children}
  </select>
);

// Textarea
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = ({ className = "", ...props }: TextareaProps) => (
  <textarea
    {...props}
    className={`w-full px-4 py-2.5 border border-white/10 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all resize-none backdrop-blur-xl ${className}`}
  />
);

// Badge
interface BadgeProps {
  children: ReactNode;
  variant?: "blue" | "green" | "yellow" | "red" | "gray";
}

export const Badge = ({ children, variant = "blue" }: BadgeProps) => {
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// Icon Button
export interface IconButtonProps {
  onClick?: () => void;
  variant?: "default" | "danger";
  children: ReactNode;
  className?: string;
}

export const IconButton = ({
  onClick,
  variant = "default",
  children,
  className = "",
}: IconButtonProps) => {
  const variants = {
    default: "text-gray-400 hover:text-blue-600 hover:bg-blue-50",
    danger: "text-gray-400 hover:text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface ConfirmIconButtonProps extends Omit<IconButtonProps, "onClick"> {
  confirmMessage: string;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmIconButton = ({
  confirmMessage,
  onConfirm,
  ...props
}: ConfirmIconButtonProps) => {
  const handleClick = async () => {
    if (!confirm(confirmMessage)) return;
    await onConfirm();
  };

  return <IconButton {...props} onClick={handleClick} />;
};

// Table
interface TableProps {
  children: ReactNode;
}

export const Table = ({ children }: TableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">{children}</table>
  </div>
);

export const TableHead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-white/10">
    {children}
  </thead>
);

export const TableBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-white/5">{children}</tbody>
);

export const TableRow = ({ children }: { children: ReactNode }) => (
  <tr className="hover:bg-slate-800/30 transition-colors">{children}</tr>
);

export const TableCell = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <td className={`px-6 py-4 ${className}`}>{children}</td>;

export const TableHeader = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <th className={`px-6 py-4 ${className}`}>{children}</th>;

export interface LocationFormCategory {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

export interface LocationFormValues {
  name: string;
  category_id: string;
  subcategory_id: string;
  latitude: string;
  longitude: string;
  address: string;
  dusun: string;
  contact: string;
  description: string;
  condition: string;
  images: string[];
}

export const defaultLocationFormValues: LocationFormValues = {
  name: "",
  category_id: "",
  subcategory_id: "",
  latitude: "",
  longitude: "",
  address: "",
  dusun: "",
  contact: "",
  description: "",
  condition: "Baik",
  images: [],
};

interface LocationFormProps {
  initialValues: LocationFormValues;
  categories: LocationFormCategory[];
  onSubmit: (values: LocationFormValues) => void | Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  submitIcon?: ReactNode;
  cancelHref: string;
  manageCategoriesHref?: string;
}

export const LocationForm = ({
  initialValues,
  categories,
  onSubmit,
  submitting = false,
  submitLabel = "Simpan",
  submittingLabel = "Menyimpan...",
  submitIcon,
  cancelHref,
  manageCategoriesHref,
}: LocationFormProps) => {
  const [formData, setFormData] = useState<LocationFormValues>(initialValues);
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput.trim()],
    }));
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.category_id
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nama Lokasi" required>
          <Input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Kantor Balai Desa"
          />
        </FormField>

        <FormField label="Kondisi">
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </Select>
        </FormField>

        <FormField label="Kategori">
          <div className="flex gap-2">
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="flex-1"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {manageCategoriesHref && (
              <Link
                href={manageCategoriesHref}
                target="_blank"
                className="px-3 py-2.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                Kelola
              </Link>
            )}
          </div>
        </FormField>

        <FormField label="Sub Kategori">
          <Select
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={handleChange}
            disabled={!selectedCategory}
          >
            <option value="">Pilih Sub Kategori</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Dusun">
          <Input
            type="text"
            name="dusun"
            value={formData.dusun}
            onChange={handleChange}
            placeholder="Nama Dusun"
          />
        </FormField>

        <FormField label="Kontak / No. HP">
          <Input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
        </FormField>

        <FormField label="Latitude" required>
          <Input
            type="number"
            name="latitude"
            step="any"
            required
            value={formData.latitude}
            onChange={handleChange}
            placeholder="-6.535"
          />
        </FormField>

        <FormField label="Longitude" required>
          <Input
            type="number"
            name="longitude"
            step="any"
            required
            value={formData.longitude}
            onChange={handleChange}
            placeholder="110.74"
          />
        </FormField>
      </div>

      <FormField label="Alamat Lengkap">
        <Textarea
          name="address"
          rows={2}
          value={formData.address}
          onChange={handleChange}
          placeholder="Alamat detail lokasi..."
        />
      </FormField>

      <FormField label="Deskripsi">
        <Textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Deskripsi tambahan..."
        />
      </FormField>

      <FormField label="Foto Lokasi (URL)">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
            />
            <Button type="button" onClick={handleAddImage} variant="secondary">
              Tambah
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={url}
                    alt={`Lokasi ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Invalid+Image";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormField>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <LinkButton href={cancelHref} variant="secondary">
          Batal
        </LinkButton>
        <Button type="submit" disabled={submitting}>
          {submitIcon}
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};
