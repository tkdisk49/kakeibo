<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // カテゴリが削除されてもtransactionsは残す（種別・金額の記録を消さないため）
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            // categoriesのtypeと重複するが、category_idがnullになっても収支種別が失われないよう
            // あえて非正規化して持たせている
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 10, 2)->unsigned(); // 符号はtypeで表すため金額は非負
            $table->date('date');
            $table->text('memo')->nullable();
            $table->timestamps();

            // 一覧表示・月次フィルタ用のインデックス
            $table->index(['user_id', 'date']);
            // 種別フィルタ用のインデックス
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
