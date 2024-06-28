// EVENTOS
/**
 * EVENTO: Después de cargar la página.
 * - Mostrar Gráficas de prueba.
 */
document.addEventListener('DOMContentLoaded', function () {
    let result = estimar([0, 1, 2], [2, 1, 4], [4], dataBase);

    const text_out = document.getElementById('result');
    text_out.textContent = result.toString();

    // Dibujado de resultado
    drawn_canvas.Tabla_HTML('myTable1', dataBase);
    drawn_canvas.Graficar('myCanvas1', [3500, 150, 3100, 3000, 3040, 3050]);
    drawn_canvas.Graficar('myCanvas2', [3500, 3100, 3000, 3040, 3050]);
    drawn_canvas.Graficar('myCanvas3', [result]);
});
