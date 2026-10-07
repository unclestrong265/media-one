<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('tx_ref')->unique();
            $table->string('package');
            $table->string('name', 120);
            $table->string('email', 254);
            $table->unsignedInteger('amount');
            $table->string('currency', 3)->default('MWK');
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_payments');
    }
};
