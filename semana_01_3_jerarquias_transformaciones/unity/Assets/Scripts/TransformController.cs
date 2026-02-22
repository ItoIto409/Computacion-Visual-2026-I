using UnityEngine;

/// <summary>
/// Controlador de transformaciones del nodo PADRE.
/// Permite modificar posición, rotación y escala via sliders desde la UI.
/// Los nodos hijo y nieto heredan automáticamente las transformaciones.
/// </summary>
public class TransformController : MonoBehaviour
{
    // ─── Rangos configurables desde el Inspector ─────────────────────
    [Header("Rangos de Posición")]
    public float posRangeX = 5f;
    public float posRangeY = 3f;
    public float posRangeZ = 5f;

    [Header("Rango de Escala")]
    public float scaleMin = 0.2f;
    public float scaleMax = 3f;

    // ─── Estado actual (leído por la UI) ─────────────────────────────
    [HideInInspector] public Vector3 currentPosition;
    [HideInInspector] public Vector3 currentRotation;
    [HideInInspector] public Vector3 currentScale;

    // ─── Animación ────────────────────────────────────────────────────
    [Header("Animación")]
    public bool  animating   = false;
    public float animSpeed   = 1f;
    public float animRadius  = 3f;

    private float   _animTime   = 0f;
    private Vector3 _originPos;
    private bool    _initialized = false;

    // ─── Valores internos de sliders (rango 0-1 → mapeado) ───────────
    private float _px, _py, _pz;       // posición normalizada
    private float _rx, _ry, _rz;       // rotación normalizada (0-1 → 0-360)
    private float _sx, _sy, _sz;       // escala normalizada

    void Start()
    {
        _originPos = transform.position;
        // Inicializar sliders al 50% (centro)
        _px = _py = _pz = 0.5f;
        _rx = _ry = _rz = 0f;
        _sx = _sy = _sz = 0.33f;   // ~1.0 en escala
        _initialized = true;
        ApplyTransforms();
    }

    void Update()
    {
        if (animating)
        {
            _animTime += Time.deltaTime * animSpeed;
            float x = Mathf.Sin(_animTime) * animRadius;
            float z = Mathf.Cos(_animTime) * animRadius;
            float y = Mathf.Sin(_animTime * 0.5f) * (animRadius * 0.3f);
            transform.position = _originPos + new Vector3(x, y, z);
            currentPosition    = transform.position;
        }
    }

    // ─── API llamada por los sliders de la UI ─────────────────────────

    public void SetPositionX(float v) { _px = v; if (!animating) ApplyTransforms(); }
    public void SetPositionY(float v) { _py = v; if (!animating) ApplyTransforms(); }
    public void SetPositionZ(float v) { _pz = v; if (!animating) ApplyTransforms(); }

    public void SetRotationX(float v) { _rx = v; ApplyTransforms(); }
    public void SetRotationY(float v) { _ry = v; ApplyTransforms(); }
    public void SetRotationZ(float v) { _rz = v; ApplyTransforms(); }

    public void SetScaleX(float v) { _sx = v; ApplyTransforms(); }
    public void SetScaleY(float v) { _sy = v; ApplyTransforms(); }
    public void SetScaleZ(float v) { _sz = v; ApplyTransforms(); }

    public void ToggleAnimation()
    {
        animating = !animating;
        if (!animating)
        {
            // Al pausar, dejar el objeto donde está
            _originPos = transform.position;
        }
    }

    public void ResetAnimation()
    {
        _animTime  = 0f;
        _originPos = Vector3.zero;
        animating  = false;
        _px = _py = _pz = 0.5f;
        _rx = _ry = _rz = 0f;
        _sx = _sy = _sz = 0.33f;
        ApplyTransforms();
    }

    // ─── Aplicar transformaciones al GameObject ────────────────────────
    private void ApplyTransforms()
    {
        if (!_initialized) return;

        // Posición: slider 0-1 → rango [-range, +range]
        float px = Mathf.Lerp(-posRangeX, posRangeX, _px);
        float py = Mathf.Lerp(-posRangeY, posRangeY, _py);
        float pz = Mathf.Lerp(-posRangeZ, posRangeZ, _pz);
        transform.position = new Vector3(px, py, pz);

        // Rotación: slider 0-1 → 0° a 360°
        float rx = _rx * 360f;
        float ry = _ry * 360f;
        float rz = _rz * 360f;
        transform.eulerAngles = new Vector3(rx, ry, rz);

        // Escala: slider 0-1 → [scaleMin, scaleMax]
        float sx = Mathf.Lerp(scaleMin, scaleMax, _sx);
        float sy = Mathf.Lerp(scaleMin, scaleMax, _sy);
        float sz = Mathf.Lerp(scaleMin, scaleMax, _sz);
        transform.localScale = new Vector3(sx, sy, sz);

        // Guardar estado para la UI
        currentPosition = transform.position;
        currentRotation = transform.eulerAngles;
        currentScale    = transform.localScale;
    }

    // ─── Propiedades de solo lectura para acceso externo ──────────────
    public float PosRangeX => posRangeX;
    public float PosRangeY => posRangeY;
    public float PosRangeZ => posRangeZ;
    public float ScaleMin  => scaleMin;
    public float ScaleMax  => scaleMax;
}
