const searchAddress = async () => {
    const rawZipcode = document.getElementById('zipcode').value;
    const resultDiv = document.getElementById('result');

    // ハイフンを除去して正規化
    const zipcode = rawZipcode.replace(/-/g, '');

    // 簡易バリデーション (7桁の半角数字)
    if (!/^\d{7}$/.test(zipcode)) {
        resultDiv.innerHTML = '<span class="text-xl font-bold text-red-600">郵便番号は「XXXXXXX」または「XXX-XXXX」の形式で入力してください</span>';
        resultDiv.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
        const data = await response.json();

        if (data.results) {
            const address = data.results[0];
            // カタカナを漢字住所の上部に配置
            resultDiv.innerHTML = `
                <div class="text-sm text-gray-500">${address.kana1}${address.kana2}${address.kana3}</div>
                <div class="text-lg font-semibold text-gray-800">${address.address1}${address.address2}${address.address3}</div>
            `;
            resultDiv.classList.remove('hidden');
        } else {
            resultDiv.innerHTML = '<span class="text-xl font-bold text-red-600">該当する住所が見つかりませんでした</span>';
            resultDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = '<span class="text-xl font-bold text-red-600">通信エラーが発生しました</span>';
        resultDiv.classList.remove('hidden');
    }
};

// 検索ボタンクリック時のイベントリスナー
document.getElementById('search-btn').addEventListener('click', searchAddress);

// Enterキー押下時のイベントリスナー
document.getElementById('zipcode').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchAddress();
    }
});
