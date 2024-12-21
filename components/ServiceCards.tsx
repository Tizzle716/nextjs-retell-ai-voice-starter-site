'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Paintbrush, Hammer, Sofa, Bath } from "lucide-react";
import styles from './ServiceCards.module.css';

const services = [
  {
    title: "Kitchen Remodeling",
    description: "Transform your kitchen with modern designs and premium materials",
    icon: Hammer,
  },
  {
    title: "Bathroom Renovation",
    description: "Upgrade your bathroom with elegant fixtures and contemporary styles",
    icon: Bath,
  },
  {
    title: "Interior Design",
    description: "Create stunning living spaces with expert design consultation",
    icon: Paintbrush,
  },
  {
    title: "Home Furnishing",
    description: "Complete your space with carefully curated furniture and decor",
    icon: Sofa,
  },
];

const ServiceCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 p-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <Card key={index} className="relative overflow-hidden bg-black/40 backdrop-blur-sm border-0 group">
            <CardContent className="p-4 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="mb-4 p-2 inline-block rounded-lg bg-orange-400/20">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceCards;
