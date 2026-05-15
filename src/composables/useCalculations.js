export function useCalculations() {
  function getSafeDate(year, month, day) {
    let d = new Date(year, month, day, 12, 0, 0)
    if (d.getMonth() !== ((month % 12 + 12) % 12)) d = new Date(year, month + 1, 0, 12, 0, 0)
    return d
  }

  function formatDateUI(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, '0')
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const y = dateObj.getFullYear()
    return `${d}/${m}/${y}`
  }

  function getMonthKey(dateObj) {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
  }

  function calculateCardCycles(card) {
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    const currY = today.getFullYear()
    const currM = today.getMonth()

    const C_curr = getSafeDate(currY, currM, card.cutoffDay)
    const C_next = getSafeDate(currY, currM + 1, card.cutoffDay)

    const P_curr = new Date(C_curr)
    P_curr.setDate(P_curr.getDate() + card.paymentDays)

    const P_next = new Date(C_next)
    P_next.setDate(P_next.getDate() + card.paymentDays)

    let Debt_PastAndCurrent = 0
    let Debt_Next = 0
    let Total_Active_Debt = 0

    const purchases = card.purchases || []
    purchases.forEach(p => {
      const pDate = new Date(p.date + "T12:00:00")

      let baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth(), card.cutoffDay)

      if (pDate > baseCutoff) {
        baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth() + 1, card.cutoffDay)
      }

      if (p.isRecurring) {
        Debt_PastAndCurrent += p.amount
        Debt_Next += p.amount
        Total_Active_Debt += p.amount
        return
      }

      if (p.isMSI) {
        const monthly = p.amount / p.months

        for (let i = 0; i < p.months; i++) {
          const instCutoff = getSafeDate(baseCutoff.getFullYear(), baseCutoff.getMonth() + i, card.cutoffDay)
          const instPayment = new Date(instCutoff)
          instPayment.setDate(instPayment.getDate() + card.paymentDays)

          if (instPayment < today) continue

          Total_Active_Debt += monthly

          if (instPayment >= today && instPayment <= P_curr) {
            Debt_PastAndCurrent += monthly
          } else if (instPayment > P_curr && instPayment <= P_next) {
            Debt_Next += monthly
          }
        }
        return
      }

      const paymentDate = new Date(baseCutoff)
      paymentDate.setDate(paymentDate.getDate() + card.paymentDays)

      if (paymentDate < today) return

      Total_Active_Debt += p.amount

      if (paymentDate >= today && paymentDate <= P_curr) {
        Debt_PastAndCurrent += p.amount
      } else if (paymentDate > P_curr && paymentDate <= P_next) {
        Debt_Next += p.amount
      }
    })

    const abonos = Math.max(0, Total_Active_Debt - card.usedBalance)
    const A_Pagar_Este_Mes = Math.max(0, Debt_PastAndCurrent - abonos)
    const abonosRestantes = Math.max(0, abonos - Debt_PastAndCurrent)
    const A_Pagar_Prox_Mes = Math.max(0, Debt_Next - abonosRestantes)

    return {
      C_curr,
      P_curr,
      C_next,
      P_next,
      A_Pagar_Este_Mes,
      A_Pagar_Prox_Mes,
      Total_Active_Debt
    }
  }

  function calculateMSIPaidMonths(purchase, card) {
    if (!purchase.isMSI) return 0

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    const pDate = new Date(purchase.date + "T12:00:00")

    let baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth(), card.cutoffDay)

    if (pDate > baseCutoff) {
      baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth() + 1, card.cutoffDay)
    }

    let paidMonths = 0

    for (let i = 0; i < purchase.months; i++) {
      const instCutoff = getSafeDate(baseCutoff.getFullYear(), baseCutoff.getMonth() + i, card.cutoffDay)
      const instPayment = new Date(instCutoff)
      instPayment.setDate(instPayment.getDate() + card.paymentDays)

      if (instPayment < today) {
        paidMonths++
      }
    }

    return paidMonths
  }

  function calculateGlobalProjections(cards) {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    
    const projections = []
    
    // Generar las columnas (próximos 12 meses)
    for (let i = 0; i < 12; i++) {
      const projDate = new Date(today.getFullYear(), today.getMonth() + i, 1)
      projections.push({
        key: getMonthKey(projDate),
        label: projDate.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }).toUpperCase(),
        total: 0
      })
    }

    cards.forEach(card => {
      const purchases = card.purchases || []
      
      purchases.forEach(p => {
        const pDate = new Date(p.date + "T12:00:00")
        let baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth(), card.cutoffDay)
        if (pDate > baseCutoff) {
          baseCutoff = getSafeDate(pDate.getFullYear(), pDate.getMonth() + 1, card.cutoffDay)
        }

        if (p.isRecurring) {
          projections.forEach(proj => {
            proj.total += p.amount
          })
          return
        }

        if (p.isMSI) {
          const monthly = p.amount / p.months
          for (let i = 0; i < p.months; i++) {
            const instCutoff = getSafeDate(baseCutoff.getFullYear(), baseCutoff.getMonth() + i, card.cutoffDay)
            const instPayment = new Date(instCutoff)
            instPayment.setDate(instPayment.getDate() + card.paymentDays)

            if (instPayment < today) continue

            const paymentKey = getMonthKey(instPayment)
            const projObj = projections.find(pr => pr.key === paymentKey)
            if (projObj) {
              projObj.total += monthly
            }
          }
          return
        }

        // Compra normal
        const paymentDate = new Date(baseCutoff)
        paymentDate.setDate(paymentDate.getDate() + card.paymentDays)

        if (paymentDate < today) return

        const paymentKey = getMonthKey(paymentDate)
        const projObj = projections.find(pr => pr.key === paymentKey)
        if (projObj) {
          projObj.total += p.amount
        }
      })
    })

    return projections
  }

  return {
    getSafeDate,
    formatDateUI,
    getMonthKey,
    calculateCardCycles,
    calculateMSIPaidMonths,
    calculateGlobalProjections
  }
}
