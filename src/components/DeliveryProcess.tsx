"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  PackageCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Order Placed",
    description:
      "Apanar order-ti shofolbhabe grahon kora hoyeche ebong processing chaluchhe.",
    icon: ShoppingCart,
    badge: "Step 01",
  },
  {
    id: 2,
    title: "Processing & Packing",
    description:
      "Amader team amader warehouse theke apanar purno-ti check kore packaging korche.",
    icon: PackageCheck,
    badge: "Step 02",
  },
  {
    id: 3,
    title: "On the Way",
    description:
      "Apanar parcel-ti courier partner-er kache bujhiye deoya hoyeche ebong gontobyer dike jachhe.",
    icon: Truck,
    badge: "Step 03",
  },
  {
    id: 4,
    title: "Successfully Delivered",
    description:
      "Apanar thikanay utshobmukhor bhabe ponchhey geche. Dhonnobad amader sathe thakar jonne!",
    icon: CheckCircle2,
    badge: "Step 04",
  },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function DeliveryProcess() {
  return (
    <div className="bg-[#FAF5FF] dark:bg-[#0b1325]">
      <section className="py-16 lg:py-20 px-4  overflow-hidden">
        <div className="max-w-[1860px] mx-auto px-5 lg:px-8">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-purple-100 text-[#7E22CE]  text-xs font-bold rounded-full mb-3 tracking-wider uppercase shadow-sm"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-[30px] font-bold text-purple-950 dark:text-white tracking-tight"
            >
              Amader Seamless Delivery Process
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-purple-900/80 dark:text-white text-sm md:text-base"
            >
              Apanar order korar por theke hate poya porjonto prothi steps khoob
              shohoj ebong transparent.
            </motion.p>
          </div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <motion.div
                  key={step.id}
                  //   variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative group bg-white rounded-xl p-6 shadow-sm shadow-purple-900/5 hover:shadow-md hover:shadow-purple-950/10 transition-all duration-300 border border-purple-100 flex flex-col justify-between"
                >
                  {/* Connecting Arrow for Desktop */}
                  {!isLast && (
                    <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="p-1.5 bg-white border border-purple-100 rounded-full text-purple-300 group-hover:text-[#7E22CE] group-hover:border-purple-200 transition-colors shadow-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  )}

                  <div>
                    {/* Top Badge & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold text-purple-400 group-hover:text-[#7E22CE] transition-colors">
                        {step.badge}
                      </span>

                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-12 h-12 rounded-xl bg-[#FAF5FF] text-purple-950 group-hover:bg-[#7E22CE] group-hover:text-white flex items-center justify-center shadow-inner transition-colors duration-300"
                      >
                        <IconComponent className="w-6 h-6 stroke-[1.8]" />
                      </motion.div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-purple-950 mb-2 group-hover:text-[#7E22CE] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Animated Bottom Line */}
                  <div className="mt-6 pt-4 border-t border-purple-50 flex items-center justify-between text-xs font-semibold text-purple-400">
                    <span>Progress</span>
                    <div className="w-16 bg-purple-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="bg-[#7E22CE] h-full rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
