"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductQASection } from "@/components/shop/ProductQASection";
import { formatDateINR } from "@/lib/utils";

export default function ProductTabs({
    specificationRows,
    productReviews,
    productQuestions,
    displayRating,
    reviewCount,
    product
}: any) {
    const [activeTab, setActiveTab] = useState("specs");

    const tabs = [
        { key: "specs", label: "Specifications" },
        { key: "reviews", label: `Reviews (${reviewCount})` },
        { key: "qa", label: "Q&A" },
    ];

    return (
        <section className="mt-12">

            {/* Tabs Header */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === tab.key
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-8">

                {/* Specifications */}
                {activeTab === "specs" && (
                    <div className="space-y-3">
                        {specificationRows.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">
                                No specifications available.
                            </p>
                        ) : (
                            specificationRows.map((spec: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex text-sm border-b border-gray-100 pb-2"
                                >
                                    <dt className="w-1/3 font-semibold text-gray-700">
                                        {spec.key || spec.name}
                                    </dt>
                                    <dd className="w-2/3 text-gray-600">
                                        {spec.value}
                                    </dd>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Reviews */}
                {activeTab === "reviews" && (
                    <div className="space-y-10">

                        {/* Rating Summary Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6">

                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl font-light text-gray-900">
                                        {displayRating}
                                    </span>
                                    <span className="text-gray-400 text-sm">/ 5</span>
                                </div>

                                <div className="flex mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        let fillValue = displayRating >= star ? 1 : 0;

                                        return (
                                            <span
                                                key={star}
                                                className="material-symbols-outlined text-amber-400"
                                                style={{ fontVariationSettings: `'FILL' ${fillValue}` }}
                                            >
                                                star
                                            </span>
                                        );
                                    })}
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                    Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                                </p>
                            </div>

                            <Link
                                href="/account/reviews"
                                className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-widest border border-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition"
                            >
                                View all reviews
                            </Link>

                        </div>

                        {/* Reviews List */}
                        {productReviews.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">
                                No reviews yet. Be the first to review this product.
                            </p>
                        ) : (
                            <div className="space-y-8">
                                {productReviews.map((rev: any) => {
                                    const author =
                                        rev.profiles?.full_name?.trim() ||
                                        "Verified customer";

                                    const stars = rev.rating ?? 0;

                                    return (
                                        <div
                                            key={rev.id}
                                            className="border-b border-gray-100 pb-6 last:border-none"
                                        >

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-2">

                                                <div className="flex items-center gap-3">

                                                    {/* Stars */}
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className="material-symbols-outlined text-[18px]"
                                                                style={{
                                                                    fontVariationSettings:
                                                                        i < stars
                                                                            ? "'FILL' 1"
                                                                            : "'FILL' 0",
                                                                }}
                                                            >
                                                                star
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Author */}
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {author}
                                                    </span>

                                                </div>

                                                {/* Date */}
                                                <span className="text-xs text-gray-400">
                                                    {formatDateINR(rev.created_at)}
                                                </span>

                                            </div>

                                            {/* Comment */}
                                            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                                {rev.comment || "No written comment."}
                                            </p>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Q&A */}
                {activeTab === "qa" && (
                    <div>
                        <ProductQASection
                            productId={product.id}
                            productName={product.name}
                            initialQuestions={productQuestions}
                        />
                    </div>
                )}

            </div>
        </section>
    );
}