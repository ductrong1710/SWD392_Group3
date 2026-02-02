"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit2, Plus } from "lucide-react";
import { userApi, UserProfile } from "../../services/api";

interface UserProfilePageProps {
  onBack: () => void;
}

export default function UserProfilePage({ onBack }: UserProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive">{error || "Profile not found"}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">My Profile</h2>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <button className="p-2 hover:bg-secondary rounded transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{profile.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{profile.phone || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        {profile.addresses && profile.addresses.length > 0 ? (
          <div className="space-y-4">
            {profile.addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg ${
                  address.isDefault ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.addressLine}, {address.city}
                      </p>
                    </div>
                  </div>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                      Default
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No saved addresses yet
          </p>
        )}
      </div>
    </div>
  );
}