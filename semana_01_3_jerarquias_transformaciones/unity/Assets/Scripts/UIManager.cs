using UnityEngine;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// Gestiona toda la interfaz: sliders, etiquetas de valores,
/// botones de animación y panel de información estructural.
/// </summary>
public class UIManager : MonoBehaviour
{
    // ─── Referencia al controlador ────────────────────────────────────
    [Header("Controlador de Transformaciones")]
    public TransformController target;

    // ─── Sliders de Posición ──────────────────────────────────────────
    [Header("Sliders — Posición")]
    public Slider sliderPX;
    public Slider sliderPY;
    public Slider sliderPZ;

    // ─── Sliders de Rotación ──────────────────────────────────────────
    [Header("Sliders — Rotación")]
    public Slider sliderRX;
    public Slider sliderRY;
    public Slider sliderRZ;

    // ─── Sliders de Escala ────────────────────────────────────────────
    [Header("Sliders — Escala")]
    public Slider sliderSX;
    public Slider sliderSY;
    public Slider sliderSZ;

    // ─── Etiquetas de valores actuales ───────────────────────────────
    [Header("Labels — Valores en Tiempo Real")]
    public TextMeshProUGUI labelPosition;
    public TextMeshProUGUI labelRotation;
    public TextMeshProUGUI labelScale;

    // ─── Botones de animación ─────────────────────────────────────────
    [Header("Botones")]
    public Button  btnToggleAnim;
    public Button  btnReset;
    public TextMeshProUGUI labelToggleBtn;

    // ─── Panel de jerarquía ───────────────────────────────────────────
    [Header("Jerarquía")]
    public TextMeshProUGUI labelHierarchy;
    public Transform       padreTransform;   // El nodo raíz de la jerarquía

    void Start()
    {
        // Inicializar rangos de sliders (todos 0-1; el controlador mapea los valores)
        InitSlider(sliderPX, 0.5f, target.SetPositionX);
        InitSlider(sliderPY, 0.5f, target.SetPositionY);
        InitSlider(sliderPZ, 0.5f, target.SetPositionZ);

        InitSlider(sliderRX, 0f, target.SetRotationX);
        InitSlider(sliderRY, 0f, target.SetRotationY);
        InitSlider(sliderRZ, 0f, target.SetRotationZ);

        InitSlider(sliderSX, 0.33f, target.SetScaleX);
        InitSlider(sliderSY, 0.33f, target.SetScaleY);
        InitSlider(sliderSZ, 0.33f, target.SetScaleZ);

        // Botones
        btnToggleAnim.onClick.AddListener(OnToggleAnim);
        btnReset.onClick.AddListener(OnReset);

        // Jerarquía inicial
        RefreshHierarchy();
    }

    void Update()
    {
        // Actualizar etiquetas cada frame
        if (target == null) return;

        Vector3 pos = target.currentPosition;
        Vector3 rot = target.currentRotation;
        Vector3 scl = target.currentScale;

        labelPosition.text =
            $"<b>Posición</b>\n" +
            $"X: {pos.x,7:F3}\n" +
            $"Y: {pos.y,7:F3}\n" +
            $"Z: {pos.z,7:F3}";

        labelRotation.text =
            $"<b>Rotación</b>\n" +
            $"X: {rot.x,7:F1}°\n" +
            $"Y: {rot.y,7:F1}°\n" +
            $"Z: {rot.z,7:F1}°";

        labelScale.text =
            $"<b>Escala</b>\n" +
            $"X: {scl.x,7:F3}\n" +
            $"Y: {scl.y,7:F3}\n" +
            $"Z: {scl.z,7:F3}";

        // Actualizar botón animación
        labelToggleBtn.text = target.animating ? "⏸ Pausar" : "▶ Animar";
    }

    // ─── Helpers ──────────────────────────────────────────────────────
    private void InitSlider(Slider s, float initialValue,
                            UnityEngine.Events.UnityAction<float> callback)
    {
        if (s == null) return;
        s.minValue = 0f;
        s.maxValue = 1f;
        s.value    = initialValue;
        s.onValueChanged.AddListener(callback);
    }

    private void OnToggleAnim()
    {
        target.ToggleAnimation();
    }

    private void OnReset()
    {
        target.ResetAnimation();
        // Resincronizar sliders a posición neutral
        if (sliderPX) sliderPX.SetValueWithoutNotify(0.5f);
        if (sliderPY) sliderPY.SetValueWithoutNotify(0.5f);
        if (sliderPZ) sliderPZ.SetValueWithoutNotify(0.5f);
        if (sliderRX) sliderRX.SetValueWithoutNotify(0f);
        if (sliderRY) sliderRY.SetValueWithoutNotify(0f);
        if (sliderRZ) sliderRZ.SetValueWithoutNotify(0f);
        if (sliderSX) sliderSX.SetValueWithoutNotify(0.33f);
        if (sliderSY) sliderSY.SetValueWithoutNotify(0.33f);
        if (sliderSZ) sliderSZ.SetValueWithoutNotify(0.33f);
    }

    /// <summary>
    /// Construye y muestra el árbol de jerarquía en el panel lateral.
    /// </summary>
    private void RefreshHierarchy()
    {
        if (padreTransform == null || labelHierarchy == null) return;
        labelHierarchy.text = BuildTree(padreTransform, 0);
    }

    private string BuildTree(Transform t, int depth)
    {
        string indent = new string(' ', depth * 4);
        string prefix = depth == 0 ? "👑 " : depth == 1 ? "├─ 🔷 " : "│  └─ 🔸 ";
        string result = $"{indent}{prefix}<b>{t.name}</b>\n";
        foreach (Transform child in t)
            result += BuildTree(child, depth + 1);
        return result;
    }
}
