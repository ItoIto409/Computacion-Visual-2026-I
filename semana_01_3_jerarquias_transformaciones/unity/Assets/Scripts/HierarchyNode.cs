using UnityEngine;

/// <summary>
/// Adjunto a cada nodo (padre, hijo, nieto).
/// Muestra en consola su transformación WORLD y LOCAL cada vez que cambia,
/// y dibuja gizmos en el editor para visualizar los ejes.
/// </summary>
public class HierarchyNode : MonoBehaviour
{
    [Header("Configuración del Nodo")]
    public string  nodeName    = "Nodo";
    public Color   gizmoColor  = Color.white;
    public float   gizmoSize   = 0.3f;
    public bool    logOnChange = true;

    private Vector3    _lastWorldPos;
    private Quaternion _lastWorldRot;
    private Vector3    _lastWorldScl;

    void Start()
    {
        _lastWorldPos = transform.position;
        _lastWorldRot = transform.rotation;
        _lastWorldScl = transform.lossyScale;
        LogInfo("INICIO");
    }

    void Update()
    {
        bool changed =
            _lastWorldPos != transform.position    ||
            _lastWorldRot != transform.rotation    ||
            _lastWorldScl != transform.lossyScale;

        if (changed && logOnChange)
        {
            LogInfo("CAMBIO");
            _lastWorldPos = transform.position;
            _lastWorldRot = transform.rotation;
            _lastWorldScl = transform.lossyScale;
        }
    }

    private void LogInfo(string evento)
    {
        string depth = GetDepthLabel();
        Debug.Log(
            $"[{depth}] {nodeName} — {evento}\n" +
            $"  POS  mundo : {transform.position.ToString("F3")}\n" +
            $"  POS  local : {transform.localPosition.ToString("F3")}\n" +
            $"  ROT  mundo : {transform.eulerAngles.ToString("F1")}\n" +
            $"  ROT  local : {transform.localEulerAngles.ToString("F1")}\n" +
            $"  SCAL mundo : {transform.lossyScale.ToString("F3")}\n" +
            $"  SCAL local : {transform.localScale.ToString("F3")}"
        );
    }

    private string GetDepthLabel()
    {
        int depth = 0;
        Transform t = transform;
        while (t.parent != null) { depth++; t = t.parent; }
        return depth == 0 ? "PADRE" : depth == 1 ? "HIJO " : "NIETO";
    }

    // ─── Gizmos en el editor ──────────────────────────────────────────
    void OnDrawGizmos()
    {
        // Esfera central del nodo
        Gizmos.color = gizmoColor;
        Gizmos.DrawWireSphere(transform.position, gizmoSize);

        // Ejes locales
        float len = gizmoSize * 3f;
        Gizmos.color = Color.red;
        Gizmos.DrawRay(transform.position, transform.right   * len);
        Gizmos.color = Color.green;
        Gizmos.DrawRay(transform.position, transform.up      * len);
        Gizmos.color = Color.blue;
        Gizmos.DrawRay(transform.position, transform.forward * len);

        // Línea al padre
        if (transform.parent != null)
        {
            Gizmos.color = new Color(gizmoColor.r, gizmoColor.g, gizmoColor.b, 0.4f);
            Gizmos.DrawLine(transform.position, transform.parent.position);
        }
    }

    void OnDrawGizmosSelected()
    {
        // Esfera sólida al seleccionar
        Gizmos.color = new Color(gizmoColor.r, gizmoColor.g, gizmoColor.b, 0.3f);
        Gizmos.DrawSphere(transform.position, gizmoSize * 1.2f);
    }
}
